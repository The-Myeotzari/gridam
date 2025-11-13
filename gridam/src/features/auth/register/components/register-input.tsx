export default function registerInput() {
  return (
    <>
      <Input
        type="text"
        {...register('nickname', {
          validate: (value) => {
            if (!NICKNAME_REGEX.test(value)) {
              return MESSAGES.AUTH.ERROR.INVALID_NICKNAME_FORMAT
            }
          },
          required: true,
        })}
        id="nickname"
        className="w-full"
        placeholder="귀여운 닉네임"
      />
    </>
  )
}
