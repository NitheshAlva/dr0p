'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Upload} from "lucide-react"
import { FlipWords } from "@/components/ui/flip-words";
import { FeatureSteps } from "@/components/feature-section";
import { SlideButton } from "@/components/ui/get-started-button";
import Footer from "@/components/Footer";
import { features } from "@/data/features";
import { Feature } from "@/components/Feature";
import { steps } from "@/data/steps";
import {Sparkles} from '@/components/Sparkles'

export default function Home() {

  return (
    <div className=" flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen mt-10 py-20 md:py-28">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Instant Sharing, Zero Hassle.
              </h1>
              <div className="mt-15 mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                <b>dr0p</b> lets you send notes and files between devices effortlessly.
                <br className="hidden sm:inline" />
                No<FlipWords className="font-large" words={['signups', 'fuss']}/>just type, upload, and share.
              </div>
            </div>
            <div className=" flex flex-col sm:flex-row gap-4 mt-12 z-10 ">
              <Link href="/note">
                <Button size="lg" className="gap-2 cursor-pointer">
                  <FileText className="h-5 w-5" />
                  Create a Note
                </Button>
              </Link>
              <Link href="/file">
                <Button size="lg" variant="outline" className="gap-2 cursor-pointer">
                  <Upload className="h-5 w-5" />
                  Upload a File
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative -mt-32 h-96 w-full overflow-hidden">
          {/* Gradient background with mask */}
          <div className="absolute inset-0 [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#7876c566] after:bg-zinc-900"></div>
          
          {/* Sparkles contained within parent */}
          <div className="absolute inset-0 [mask-image:radial-gradient(50%_50%,white,transparent_85%)]">
            <Sparkles
              className="w-full h-full"
              lightModeColor="rgba(51, 51, 51, 0.7)"
              darkModeColor="rgba(255, 255, 255, 0.7)"
              size={1.5}
              density={1200}
              speed={0.8}
              opacity={0.7}
              options={{
                fullScreen: {
                  enable: false,
                  zIndex: -1
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 ">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 flex items-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl pr-2">Why dr0p?</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Simple tools for sharing content instantly
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Feature key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How dr0p Makes Sharing Simple</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Share content in just a few seconds
              </p>
            </div>
          </div>
          <FeatureSteps
            features={steps}
            title=""
            autoPlayInterval={5000}
            imageHeight="h-[450px]"
          />

          <div className="flex justify-center mt-12">
            <Link href="/note/" >
              <SlideButton/>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
