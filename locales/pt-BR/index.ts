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
    pickOne: 'Escolha um',
    back: 'Voltar',
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
    forgotPassword: {
      title: 'Redefinir senha',
      description:
        'Insira o e-mail associado a sua conta e enviaremos um e-mail com instruções para redefinir sua senha.',
      email: 'E-mail',
      btnSend: 'Enviar instruções',
      error: {
        emailRequired: {
          title: 'E-mail é obrigatório',
          description: 'Por favor, insira seu e-mail',
        },
      },
      success: {
        title: 'E-mail enviado',
        description:
          'Um link para redefinir sua senha foi enviado para seu e-mail',
      },
    },
    checkEmail: {
      title: 'Verifique seu e-mail',
      description: 'Enviamos um e-mail com um link para redefinir sua senha',
      btnOpen: 'Abrir e-mail',
      later: 'Irei verificar mais tarde',
      notReceived: 'Não recebeu o e-mail? Verifique sua pasta de spam ou',
      notReceivedLink: 'tentar novamente com outro e-mail.',
    },
    resetPassword: {
      title: 'Criar nova senha',
      description: 'Sua nova senha deve ser diferente das senhas anteriores.',
      password: 'Senha',
      confirmPassword: 'Confirmar senha',
      btnReset: 'Redefinir senha',
      passwordHint: 'Deve ter pelo menos 8 caracteres',
      confirmPasswordHint: 'Ambas as senhas devem ser iguais',
      success: {
        title: 'Senha redefinida',
        description: 'Sua senha foi redefinida. Você pode agora logar',
      },
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
  profile: {
    account: 'Conta',
    preferences: {
      title: 'Preferências',
      darkMode: 'Modo escuro',
      language: 'Idioma',
      changePassword: 'Alterar senha',
    },
    dialog: {
      update: {
        title: 'Atualizar conta',
        name: 'Nome',
        email: 'E-mail',
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
