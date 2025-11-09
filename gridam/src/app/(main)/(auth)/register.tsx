'use client'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from '@/store/useToast'

export default function Register() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignUpClick = () => {
    //"모든 항목을 입력해 주세요."
    const fields = {
      닉네임: nickname,
      이메일: email,
      비밀번호: password,
      '비밀번호 확인': confirmPassword,
    }

    const emptyField = Object.entries(fields).find(([key, value]) => value.trim() === '')
    if (emptyField) {
      toast.error(`${emptyField[0]}을(를) 입력해 주세요.`)
      return
    }
    //이메일 형식이 올바르지 않습니다.
    const emailRegex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
    if (!emailRegex.test(email)) {
      toast.error('이메일 형식이 올바르지 않습니다.')
      return
    }
    //비밀번호 8자 이상
    if (password.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    //비밀번호 대소문자, 특수문자 포함
    //(?=.*\d)?
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    if (!passwordRegex.test(password)) {
      toast.error('비밀번호에는 대소문자와 특수문자가 포함되어야 합니다.')
      return
    }
    //비밀번호가 일치하지 않습니다.
    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.')
    }
  }

  return (
    <Card indent="none">
      <CardHeader
        align="vertical"
        cardImage={<img src="/favicon.ico" alt="그리담로고"></img>}
        cardTitle={<h1 className="text-4xl mb-2 text-navy-gray">회원가입</h1>}
        cardDescription={<p className="text-lg">그리담과 함께 시작해요</p>}
      />

      <CardBody>
        <form onSubmit={handleSignUpClick} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 ">
            <label htmlFor="nickname" className="text-lg text-left font-semibold">
              닉네임
            </label>
            <Input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value)
              }}
              id="nickname"
              className="w-full"
              placeholder="귀여운 닉네임"
              required
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <label htmlFor="email" className="text-lg  text-left font-semibold">
              이메일
            </label>
            <Input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              id="email"
              className="w-full"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <label htmlFor="password" className="text-lg text-left font-semibold">
              비밀번호
            </label>
            <Input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              id="password"
              className="w-full"
              placeholder="• • • • • • • •"
              required
            />
          </div>
          <div className="flex flex-col gap-2 ">
            <label htmlFor="comfirmPassword" className="text-lg text-left font-semibold">
              비밀번호 확인
            </label>
            <Input
              type="text"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
              }}
              id="comfirmPassword"
              className="w-full"
              placeholder="• • • • • • • •"
              required
            />
          </div>
        </form>
      </CardBody>

      <CardFooter className="flex-col">
        <Button
          type="submit"
          onClick={handleSignUpClick}
          variant="gradient"
          size="lg"
          className="w-full text-xl"
          label={'가입하기'}
        />

        <div className="mt-6 text-center flex gap-1">
          <div className="font-handwritten text-base text-muted-foreground">
            이미 계정이 있으신가요?
          </div>

          <Link href="/login" className="text-base text-primary hover:underline">
            로그인
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
