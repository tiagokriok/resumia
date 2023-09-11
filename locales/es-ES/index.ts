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
  errors: {
    files: {
      noFileSelectedTitle: 'No se ha seleccionado ningún archivo',
      noFileSelectedDescription: 'Por favor, seleccione un archivo para subir',
    },
    commons: {
      unknownError: 'Algo salió mal',
    },
  },
}
