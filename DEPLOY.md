# How to Host Your Website for Free

This project is configured to be deployed using **Firebase App Hosting**, which offers a generous free tier perfect for portfolio websites, blogs, and many other web applications.

The deployment process connects your GitHub repository to Firebase, allowing for automatic deployments whenever you push new changes.

## Deployment Steps

### Step 1: Push Your Code to GitHub

Before you can deploy, your project's code must be in a GitHub repository.

1.  **Create a new repository** on [GitHub](https://github.com/new). You can make it public or private.
2.  **Push your project code** to that repository. If you are using a local development environment, you would typically run the following commands in your terminal:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
    git push -u origin main
    ```

### Step 2: Set Up a Backend in Firebase

1.  **Go to the Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com/)
2.  **Select your project**: Choose the Firebase project that is connected to this workspace.
3.  **Navigate to App Hosting**: In the left-hand menu under the "Build" category, click on **App Hosting**.
4.  **Get Started**: Click the "Get Started" button. If you don't have a billing account set up, you may be prompted to do so. (Note: App Hosting still falls within the free tier, but a billing account is required by Google Cloud).
5.  **Connect GitHub**: Follow the on-screen instructions to connect Firebase to your GitHub account and select the repository you created in Step 1.
6.  **Configure Deployment**: Set your deployment branch (usually `main`). The "Root directory" should be left as the default (`/`).
7.  **Deploy!**: Firebase App Hosting will automatically build and deploy your site.

That's it! Your website will be live on a `*.web.app` URL. You can also connect a custom domain from the App Hosting dashboard in the Firebase console.
