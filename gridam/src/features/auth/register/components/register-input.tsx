import Input from '@/components/ui/input'
import { FieldValues, RegisterOptions, UseFormRegister, Path } from 'react-hook-form'

interface RegisterInputProps<TFormValues extends FieldValues> {
  label: string
  type?: string
  name: Path<TFormValues>
  placeholder?: string
  register: UseFormRegister<TFormValues>
  validation?: RegisterOptions<TFormValues>
  className?: string
  required?: boolean
}

export default function RegisterInput<TFormValues extends FieldValues>({
  label,
  type,
  name,
  register,
  placeholder,
  validation,
  className,
  required,
}: RegisterInputProps<TFormValues>) {
  return (
    <>
      <div className="flex flex-col gap-2 ">
        <label htmlFor={name as string} className="text-lg text-left font-semibold">
          {label}
        </label>
        <Input
          type={type}
          {...register(name, validation)}
          id={String(name)}
          placeholder={placeholder}
          className={className || 'w-full'}
        />
      </div>
    </>
  )
}
