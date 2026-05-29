export default ({ env }) => ({
  upload: {
    config: {
      provider: "@strapi/provider-upload-cloudinary",
      providerOptions: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
        params: {
          folder: "strapi-uploads",
          resource_type: "auto",
        },
      },
    },
    actionOptions: {
      upload: {
        folder: "strapi-uploads",
        formats: ["thumbnail"],
      },
    },
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
      resetPasswordUrl: env("RESET_PASSWORD_URL"),
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp.gmail.com"),
        port: env.int("SMTP_PORT", 587),
        secure: env.bool("SMTP_SECURE", false),
        auth: {
          user: env("SMTP_USER"),
          pass: env("SMTP_PASS"),
        },
      },
      settings: {
        defaultFrom: env("EMAIL_FROM", "no-reply@irisnatural.com"),
        defaultReplyTo: env("EMAIL_REPLY_TO", "hola@irisnatural.com"),
      },
    },
  },
});
