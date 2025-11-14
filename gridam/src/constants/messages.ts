export const MESSAGES = {
  AUTH: {
    SUCCESS: {
      LOGIN: '로그인이 되었습니다.',
      REGISTER: '회원가입이 완료되었습니다.',
      REGISTER_EMAIL: '이메일 인증 이메일이 발송되었습니다.',
      LOGOUT: '로그아웃 되었습니다.',
      PASSWORD_RESET: '비밀번호 재설정이 완료되었습니다.',
      PASSWORD_RESET_EMAIL: '비밀번호 재설정 이메일이 발송되었습니다.',
    },
    ERROR: {
      UNAUTHORIZED_USER: '인증되지 않은 사용자입니다. 로그인 해주세요.',
      EMPTY_EMAIL_PASSWORD: '이메일과 비밀번호를 입력해주세요.',
      EMPTY_EMAIL: '이메일을 입력해주세요.',
      WRONG_PASSWORD: '비밀번호가 일치하지 않습니다.',
      ACCOUNT_NOT_EXIST: '존재하지 않는 계정입니다.',
      REGISTER: '회원가입에 실패했습니다.',
      LOGIN: '로그인에 실패했습니다. 다시 시도해주세요.',
      LOGOUT: '로그아웃에 실패했습니다. 다시 시도해주세요.',
      WRONG_NEW_PASSWORD: '새 비밀번호가 일치하지 않습니다.',
      WRONG_CURRENT_PASSWORD: '현재 비밀번호와 일치하지 않습니다.',
      EMPTY_FORM: '모든 항목을 입력해주세요.',
      INVALID_PASSWORD_LENGTH: '비밀번호는 8자 이상이어야 합니다.',
      INVALID_PASSWORD_FORMAT:
        '비밀번호에는 숫자, 영문 대·소문자, 특수문자가 각각 최소 1개 이상 포함되어야 합니다.',
      PASSWORD_RESET: '비밀번호 재설정에 실패하었습니다.',
      INVALID_EMAIL_FORMAT: '이메일 형식이 올바르지 않습니다',
    },
  },

  DIARY: {
    SUCCESS: {
      CREATE: '일기가 저장되었습니다!',
      UPDATE: '일기가 수정되었습니다!',
      DELETE: '일기가 성공적으로 삭제되었습니다.',
    },
    ERROR: {
      CREATE: '일기 저장에 실패했습니다.',
      UPDATE: '일기 수정에 실패했습니다.',
      DELETE: '일기 삭제에 실패했습니다.',
    },
    CANCEL: {
      TITLE: '정말 뒤로 가시겠어요?',
      DESCRIPTION: `작성 중인 내용이 저장되지 않고 사라질 수 있어요.
이 작업은 되돌릴 수 없어요.`,
    },
  },
  COMMON: {
    CANCEL: '취소',
    CONFIRM: '확인',
    CANCEL_BUTTON: '취소하기',
    SAVE_BUTTON: '저장하기',
  },
} as const
