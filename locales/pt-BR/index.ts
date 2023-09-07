export default {
  common: {
    languages: {
      en: 'Inglês',
      es: 'Espanhol',
      br: 'Português',
    },
    buttons: {
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      add: 'Adicionar',
      create: 'Criar',
      edit: 'Editar',
    },
    nothingFound: 'Nenhum resultado encontrado',
    search: {
      label: 'Pesquisar',
      placeholder: 'Pesquisar aqui...',
    },
  },
  auth: {
    login: {
      title: 'Entre na sua conta',
      email: 'Seu e-mail',
      password: 'Senha',
      btnSignIn: 'Entrar',
      forgotPassword: 'Esqueceu a senha?',
      register: 'Ainda não tem uma conta?',
      linkSignUp: 'Cadastre-se',
    },
    register: {
      title: 'Cadastre-se',
      name: 'Seu nome',
      btnSignUp: 'Cadastre-se',
    },
  },
  components: {
    recentlyViewed: {
      title: 'Recentemente visto',
      seeAll: 'Ver tudo',
      noChatsTitle: 'Parece que você não tem nenhum chat',
      noChatsDescription: 'Você pode criar por clicar no botão abaixo.',
    },
    messages: {
      you: 'Você',
    },
    loading: {
      chat: {
        embedFile: 'Incorporando seu arquivo, isso pode demorar alguns minutos',
        messages: 'Carregando mensagens',
      },
    },
    search: {
      label: 'Buscar',
      placeholder: 'Pesquize aqui...',
    },
  },
  files: {
    create: {
      title: 'Enviar arquivo',
      label: 'Etiqueta',
      description: 'Descrição',
      uploadFile: 'Enviar seu arquivo',
      clickUpload: 'Clique para enviar',
      error: {
        noFileSelectedTitle: 'Nenhum arquivo selecionado',
        noFileSelectedDescription:
          'Por favor, selecione um arquivo para enviar',
      },
    },
    index: {
      title: 'Seus arquivos',
      searchLabel: 'Pesquisar',
      searchPlaceholder: 'Pesquisar um arquivo...',
      noFiles: 'Você ainda não tem nenhum arquivo',
      dialog: {
        view: {
          description: 'Descrição',
          filename: 'Nome do arquivo',
        },
        update: {
          title: 'Atualizar arquivo',
          label: 'Etiqueta',
          description: 'Descrição',
        },
        delete: {
          title: 'Confirmar exclusão',
          description: 'Você tem certeza que deseja excluir este arquivo?',
        },
      },
    },
  },
  chats: {
    index: {
      title: 'Histórico de chats',
      searchLabel: 'Pesquisar',
      searchPlaceholder: 'Pesquisar um chat...',
      noChats: 'Parece que você não tem nenhum chat',
      dialog: {
        delete: {
          title: 'Confirmar exclusão',
          description: 'Você tem certeza que deseja excluir este chat?',
        },
        create: {
          title: 'Criar chat',
          label: 'Escolha um arquivo para conversar',
          upload: 'Enviar arquivo',
        },
        update: {
          title: 'Atualizar chat',
          label: 'Etiqueta',
        },
      },
    },
  },
  errors: {
    files: {
      noFileSelectedTitle: 'Nenhum arquivo selecionado',
      noFileSelectedDescription: 'Por favor, selecione um arquivo para enviar',
    },
    commons: {
      unknownError: 'Algo deu errado',
    },
  },
}
