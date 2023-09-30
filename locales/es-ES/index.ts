export default {
  common: {
    languages: {
      en: 'Inglés',
      es: 'Español',
      br: 'Portugués',
    },
    buttons: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      add: 'Agregar',
      create: 'Crear',
      edit: 'Editar',
    },
    nothingFound: 'Ningún resultado encontrado',
    search: {
      label: 'Buscar',
      placeholder: 'Buscar aquí...',
    },
    pickOne: 'Elegir uno',
    back: 'Atrás',
  },
  auth: {
    login: {
      title: 'Inicia sesión en tu cuenta',
      email: 'Tu correo electrónico',
      password: 'Contraseña',
      btnSignIn: 'Iniciar sesión',
      forgotPassword: '¿Olvidó su contraseña?',
      register: '¿Aún no tienes una cuenta?',
      linkSignUp: 'Registrarse',
    },
    register: {
      title: 'Registrarse',
      name: 'Tu nombre',
      btnSignUp: 'Registrarse',
    },
    forgotPassword: {
      title: 'Restablecer contraseña',
      description:
        'Introduce el correo asociado con tu cuenta y te enviaremos un correo con instrucciones para restablecer tu contraseña.',
      email: 'Correo electrónico',
      btnSend: 'Enviar instrucciones',
      error: {
        emailRequired: {
          title: 'Correo electrónico es requerido',
          description: 'Por favor, introduce tu correo electrónico',
        },
      },
      success: {
        title: 'Correo electrónico enviado',
        description:
          'Un enlace para restablecer tu contraseña ha sido enviado a tu correo electrónico',
      },
    },
    checkEmail: {
      title: 'Verifica tu correo',
      description:
        'Hemos enviado un correo electrónico con un enlace para restablecer tu contraseña',
      btnOpen: 'Abrir correo electrónico',
      later: 'Lo haré más tarde',
      notReceived:
        '¿No recibiste el correo electrónico? Comprueba tu carpeta de correo no deseado o',
      notReceivedLink: 'reintentar otro correo electrónico.',
    },
    resetPassword: {
      title: 'Crear nueva contraseña',
      description:
        'Tu nueva contraseña debe ser diferente de las contraseñas anteriores',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      btnReset: 'Restablecer contraseña',
      passwordHint: 'Debe tener al menos 8 caracteres',
      confirmPasswordHint: 'Ambas contraseñas deben coincidir',
      success: {
        title: 'Contraseña restablecida',
        description:
          'Tu contraseña ha sido restablecida. Puedes iniciar sesión',
      },
    },
  },
  components: {
    recentlyViewed: {
      title: 'Recientemente visto',
      seeAll: 'Ver todo',
      noChatsTitle: 'Te parece que no tienes chats',
      noChatsDescription: 'Puedes crearlo haciendo clic en el botón.',
    },
    messages: {
      you: 'Tú',
    },
    loading: {
      chat: {
        embedFile: 'Incorporando tu archivo, esto puede tardar unos minutos',
        messages: 'Cargando mensajes',
      },
    },
    search: {
      label: 'Buscar',
      placeholder: 'Buscar aquí...',
    },
  },
  files: {
    create: {
      title: 'Subir archivo',
      label: 'Etiqueta',
      description: 'Descripción',
      uploadFile: 'Subir tu archivo',
      clickUpload: 'Clic para subir',
      error: {
        noFileSelectedTitle: 'No se ha seleccionado ningún archivo',
        noFileSelectedDescription:
          'Por favor, seleccione un archivo para subir',
      },
    },
    index: {
      title: 'Sus archivos',
      searchLabel: 'Buscar',
      searchPlaceholder: 'Buscar un archivo...',
      noFiles: 'Te parece que no tienes archivos',
      dialog: {
        view: {
          description: 'Descripción',
          filename: 'Nombre del archivo',
        },
        update: {
          title: 'Actualizar archivo',
          label: 'Etiqueta',
          description: 'Descripción',
        },
        delete: {
          title: 'Confirmar eliminación',
          description: '¿Estás seguro de que quieres eliminar este archivo?',
        },
      },
    },
  },
  chats: {
    index: {
      title: 'Historial de chats',
      searchLabel: 'Buscar',
      searchPlaceholder: 'Buscar un chat...',
      noChats: 'Te parece que no tienes chats',
      dialog: {
        delete: {
          title: 'Confirmar eliminación',
          description: '¿Estás seguro de que quieres eliminar este chat?',
        },
        create: {
          title: 'Crear chat',
          label: 'Selecciona un archivo para chatear',
          upload: 'Subir archivo',
        },
        update: {
          title: 'Actualizar chat',
          label: 'Etiqueta',
        },
      },
    },
  },
  profile: {
    account: 'Cuenta',
    preferences: {
      title: 'Preferencias',
      darkMode: 'Modo oscuro',
      language: 'Idioma',
      changePassword: 'Cambiar contraseña',
    },
    dialog: {
      update: {
        title: 'Actualizar cuenta',
        name: 'Nombre',
        email: 'Correo',
      },
    },
  },
  errors: {
    files: {
      noFileSelectedTitle: 'No se ha seleccionado ningún archivo',
      noFileSelectedDescription: 'Por favor, seleccione un archivo para subir',
    },
    commons: {
      unknownError: 'Algo salió mal',
    },
  },
  emails: {
    resetPassword: {
      title: 'Restablecer contraseña',
      description:
        'Haz click en el siguiente enlace para restablecer tu contraseña. El enlace de restablecimiento de contraseña expirará en 15 minutos.',
      link: 'Restablecer',
    },
  },
  app: {
    workspaces: {
      documents: 'Documentos',
      chats: 'Chats',
      planUpgrade: 'Upgrade',
    },
  },
}
