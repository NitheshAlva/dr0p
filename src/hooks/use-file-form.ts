import { fileSchema } from "@/schema/file.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {lookup} from 'mime-types'
import { toast } from "sonner";

export function useFileForm(name: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      name,
      file: null,
      isProtected: false,
      password: '',
      expiry: 0
    }
  });

  useEffect(() => {
    let isMounted = true;

    const validateName = async () => {
      const isValid = await form.trigger('name');
      if (!isValid && isMounted) {
        const fieldError = form.getFieldState('name').error;
        setErrorMessage(fieldError?.message || '');
      }
    };

    validateName();

    return () => {
      isMounted = false;
    };
  }, [form, name]);

  const handleDialogOpen = async () => {
    const valid = await form.trigger('file');
    if (valid) {
      setOpenDialog(true);
    }
  };

  const onSubmit = async (data:z.infer<typeof fileSchema>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const fileName = data.file[0].name,
			contentType = data.file[0].type||lookup(fileName) || 'application/octet-stream',
			contentLength = data.file[0].size
			
			const urlResp = await axios.get(`/api/file/get-upload-url?fileName=${data.file[0].name}&contentLength=${contentLength}&contentType=${contentType}`)

			await axios.put(urlResp.data.data.url, data.file[0], {
			headers: {
					'Content-Type': contentType, 
					'Content-Length': contentLength, 
					'Host': 'dr0p.s3.ap-south-1.amazonaws.com'
			}
			})

			await axios.post('/api/file/set-file', {
				name: data.name,
				password: data.password,
				isProtected: data.isProtected,
				expiry: data.expiry,
				fileName,
				contentType,
				key: urlResp.data.data.key
			})

			toast.success("File has been uploaded")
			setShowQR(true)
			form.reset()
    } catch (error) {
			console.error('Error uploading file:', error);
			if(error instanceof Error) 
      	toast.error(error.message || 'Failed to create file');
			toast.error('Failed to create file');
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false);
    }
  };

  return { form, isSubmitting, errorMessage, showQR, openDialog, setOpenDialog, handleDialogOpen, onSubmit };
}