
# dr0p

A **no-login**, fast-sharing web app for instant text and file drops — accessible from any device.

![dr0p logo](public/drop-logo.png)

---

## ✨ Features

- 📋 Instantly share **text notes** and **files** with just a name — no login required.
- 🔒 **Optional password protection** for private drops.
- ⏰ Set **auto-expiry times** for each drop (from minutes to days).
- 🌐 Accessible from any device by visiting `/note/name` or `/file/name`.
- 🗑️ Expired content is automatically removed (cleanup handled by database cron).

---



## 🧠 How It Works

- Use `POST /api/note` or `POST /api/file` to create drops.
- Access drops via `/note/[name]` or `/file/[name]`.
- On access:
  - If the drop exists:
    - 🔓 If unprotected → content is shown.
    - 🔐 If protected → user is prompted for password.
- Notes are stored in **PostgreSQL**.
- Files are stored in **Amazon S3**, and metadata in **PostgreSQL**.
- Expiry logic is enforced:
  - On access (content won't be shown if expired).
  - Via a background job that runs every minute to delete expired data.

---

## 📦 Directory Structure

```

.
├── app/
│   ├── page.tsx                # Landing page ("/")
│   ├── file/
│   │   ├── page.tsx            # File input page ("/file")
│   │   └── [name]/
│   │       └── page.tsx        # File view/download ("/file/:name")
│   ├── note/
│   │   ├── page.tsx            # Note input page ("/note")
│   │   └── [name]/
│   │       └── page.tsx        # Note view ("/note/:name")
│   └── layout.tsx              # App-wide layout
├── lib/
│   ├── db.ts                   # DB connection
│   └── s3.ts                   # S3 helper functions
├── public/                     # Static assets (logo, etc.)
├── styles/                     # CSS/SCSS styles
└── README.md

````

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/dr0p.git
cd dr0p
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# .env.local
DATABASE_URL=postgresql://<username>:<password>@<host>/<db>
AWS_S3_BUCKET_NAME=your-s3-bucket-name
AWS_S3_ACCESS_KEY=your-access-key
AWS_S3_SECRET_KEY=your-secret-key
```

> Replace values with your actual database and AWS credentials.

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the app locally.

---

## 🧪 Example URLs

* 📝 Text Note: [https://dr0p.live/note/meeting](https://dr0p.live/note/meeting)
* 📁 File Drop: [https://dr0p.live/file/report](https://dr0p.live/file/report)

---

## 📄 License

MIT — feel free to use, modify, and share.

---

## 🤝 Contributions

PRs welcome! If you have ideas, bug fixes, or enhancements, feel free to open an issue or submit a pull request.

---



