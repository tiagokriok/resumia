export default {
  common: {
    languages: {
      en: 'English',
      es: 'Spanish',
      br: 'Portuguese',
    },
    buttons: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      add: 'Add',
      create: 'Create',
      edit: 'Edit',
    },
    nothingFound: 'Nothing found',
    search: {
      label: 'Search',
      placeholder: 'Search here...',
    },
    pickOne: 'Pick one',
    back: 'Back',
  },
  auth: {
    login: {
      title: 'Sign in to your account',
      email: 'Your email',
      password: 'Password',
      btnSignIn: 'Sign in',
      forgotPassword: 'Forgot password?',
      register: 'Don’t have an account yet?',
      linkSignUp: 'Sign up',
    },
    register: {
      title: 'Sign up',
      name: 'Your Name',
      btnSignUp: 'Sign up',
    },
    forgotPassword: {
      title: 'Reset password',
      description:
        "Enter the email associated with your account and we'll send you an email with instructions to reset your password.",
      email: 'Email address',
      btnSend: 'Send Instructions',
      error: {
        emailRequired: {
          title: 'Email is required',
          description: 'Please enter your email',
        },
      },
      success: {
        title: 'Email sent',
        description:
          'A link to reset your password has been sent to your email',
      },
    },
    checkEmail: {
      title: 'Check your email',
      description: 'We’ve sent you an email with a link to reset your password',
      btnOpen: 'Open email app',
      later: "Skip, I'll check later",
      notReceived: 'Did not receive the email? Check your spam folder, or',
      notReceivedLink: 'try another email address.',
    },
    resetPassword: {
      title: 'Create new password',
      description:
        'Your new password must be different from previously used passwords.',
      password: 'Password',
      confirmPassword: 'Confirm password',
      btnReset: 'Reset password',
      passwordHint: 'Must be at least 8 characters',
      confirmPasswordHint: 'Both password must match',
      success: {
        title: 'Password reset',
        description: 'Your password has been reset. You can now log in',
      },
    },
  },
  components: {
    recentlyViewed: {
      title: 'Recently viewed',
      seeAll: 'See all',
      noChatsTitle: 'Looks like you don’t have any chats',
      noChatsDescription: 'You can create by clicking on the button below',
    },
    messages: {
      you: 'You',
    },
    loading: {
      chat: {
        embedFile: 'Embedding your file, this may take a few minutes',
        messages: 'Loading messages',
      },
    },
    search: {
      label: 'Search',
      placeholder: 'Search here...',
    },
  },
  files: {
    create: {
      title: 'Upload File',
      label: 'Label',
      description: 'Description',
      uploadFile: 'Upload your file',
      clickUpload: 'Click to upload',
      error: {
        noFileSelectedTitle: 'No file selected',
        noFileSelectedDescription: 'Please select a file to upload',
      },
    },
    index: {
      title: 'Your files',
      searchLabel: 'Search',
      searchPlaceholder: 'Search a file...',
      noFiles: "Looks like you don't have any files",
      dialog: {
        view: {
          description: 'Description',
          filename: 'File name',
        },
        update: {
          title: 'Update file',
          label: 'Label',
          description: 'Description',
        },
        delete: {
          title: 'Confirm delete',
          description: 'Are you sure you want to delete this file?',
        },
      },
    },
  },
  chats: {
    index: {
      title: 'Chats History',
      searchLabel: 'Search',
      searchPlaceholder: 'Search a chat...',
      noChats: "Looks like you don't have any chats",
      dialog: {
        delete: {
          title: 'Confirm delete',
          description: 'Are you sure you want to delete this chat?',
        },
        create: {
          title: 'Create chat',
          label: 'Select a file to chat with',
          upload: 'Upload file',
        },
        update: {
          title: 'Update chat',
          label: 'Label',
        },
      },
    },
  },
  profile: {
    account: 'Account',
    preferences: {
      title: 'Preferences',
      darkMode: 'Dark mode',
      language: 'Language',
      changePassword: 'Change password',
    },
    dialog: {
      update: {
        title: 'Update account',
        name: 'Name',
        email: 'Email',
      },
    },
  },
  errors: {
    files: {
      noFileSelectedTitle: 'No file selected',
      noFileSelectedDescription: 'Please select a file to upload',
    },
    commons: {
      unknownError: 'Something went wrong',
    },
  },
  emails: {
    resetPassword: {
      title: 'Reset password',
      description:
        'Click the link below to reset your password. This link will expire in 15 minutes.',
      link: 'Reset password',
    },
  },
}
