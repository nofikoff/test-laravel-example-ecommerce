export default {
    // Common
    common: {
        loading: 'Loading...',
        processing: 'Processing...',
        save: 'Save',
        saved: 'Saved.',
        cancel: 'Cancel',
        confirm: 'Confirm',
    },

    // Form fields
    fields: {
        name: 'Name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
    },

    // Navigation
    nav: {
        dashboard: 'Dashboard',
        profile: 'Profile',
        logOut: 'Log Out',
    },

    // Auth - Login
    login: {
        title: 'Log in',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot your password?',
        submit: 'Log in',
    },

    // Auth - Register
    register: {
        title: 'Register',
        alreadyRegistered: 'Already registered?',
        submit: 'Register',
    },

    // Auth - Forgot Password
    forgotPassword: {
        title: 'Forgot Password',
        description:
            'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.',
        submit: 'Email Password Reset Link',
    },

    // Auth - Reset Password
    resetPassword: {
        title: 'Reset Password',
        submit: 'Reset Password',
    },

    // Auth - Confirm Password
    confirmPassword: {
        title: 'Confirm Password',
        description:
            'This is a secure area of the application. Please confirm your password before continuing.',
    },

    // Auth - Verify Email
    verifyEmail: {
        title: 'Email Verification',
        description:
            "Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.",
        linkSent:
            'A new verification link has been sent to the email address you provided during registration.',
        resend: 'Resend Verification Email',
    },

    // Profile
    profile: {
        title: 'Profile',

        // Update Profile Information
        information: {
            title: 'Profile Information',
            description: "Update your account's profile information and email address.",
            unverified: 'Your email address is unverified.',
            resendVerification: 'Click here to re-send the verification email.',
            verificationSent: 'A new verification link has been sent to your email address.',
        },

        // Update Password
        password: {
            title: 'Update Password',
            description: 'Ensure your account is using a long, random password to stay secure.',
        },

        // Delete Account
        delete: {
            title: 'Delete Account',
            description:
                'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.',
            confirmTitle: 'Are you sure you want to delete your account?',
            confirmDescription:
                'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
        },
    },

    // Products
    products: {
        title: 'Products',
        noProducts: 'No products available.',
        outOfStock: 'Out of Stock',
        inStock: 'in stock',
        addToCart: 'Add to Cart',
        adding: 'Adding...',
    },

    // Cart
    cart: {
        title: 'Shopping Cart',
        closePanel: 'Close panel',
        empty: 'Your cart is empty',
        emptyDescription: 'Add some products to get started.',
        browseProducts: 'Browse Products',
        each: 'each',
        remove: 'Remove',
        total: 'Total',
        checkout: 'Checkout',
        proceedToCheckout: 'Proceed to Checkout',
        continueShopping: 'Continue Shopping',
        table: {
            product: 'Product',
            quantity: 'Quantity',
            subtotal: 'Subtotal',
            action: 'Action',
        },
    },
} as const;
