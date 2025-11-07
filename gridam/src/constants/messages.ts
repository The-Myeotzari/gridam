export const MESSAGES = {
  AUTH: {
    SUCCESS: {
      LOGIN: '로그인이 되었습니다.',
      REGISTER: '회원가입이 완료되었습니다.',
      LOGOUT: '로그아웃되었습니다.',
      PASSWORD_RESET: '비밀번호 재설정이 완료되었습니다.',
      PASSWORD_RESET_EMAIL: '비밀번호 재설정 이메일이 발송되었습니다.',
    },
    ERROR: {
      EMPTY_EMAIL_PASSWORD: '이메일과 비밀번호를 입력해주세요.',
      EMPTY_EMAIL: '이메일을 입력해주세요.',
      WRONG_PASSWORD: '비밀번호가 일치하지 않습니다.',
      ACCOUNT_NOT_EXIST: '존재하지 않는 계정입니다.',
      REGISTER: '회원가입에 실패했습니다.',
      WRONG_NEW_PASSWORD: '새 비밀번호가 일치하지 않습니다.',
      WRONG_CURRENT_PASSWORD: '현재 비밀번호와 일치하지 않습니다.',
      EMPTY_FORM: '모든 항목을 입력해주세요.',
      INVALID_PASSWORD_LENGTH: '비밀번호는 8자 이상이어야 합니다.',
      INVALID_PASSWORD_FORMAT: '비밀번호에는 대소문자와 특수문자가 포함되어야 합니다.',
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
  },
} as const
