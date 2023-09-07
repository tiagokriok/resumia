export default {
  common: {
    languages: {
      en: 'English',
      es: 'Spanish',
      br: 'Portuguese (Brazil)',
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
  errors: {
    files: {
      noFileSelectedTitle: 'No file selected',
      noFileSelectedDescription: 'Please select a file to upload',
    },
    commons: {
      unknownError: 'Something went wrong',
    },
  },
}
