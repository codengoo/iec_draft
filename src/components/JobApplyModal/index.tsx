'use client'

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import {
  IconCheck,
  IconFile,
  IconLoader2,
  IconPaperclip,
  IconX,
} from '@tabler/icons-react'
import { useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { submitJobApplication } from '@/actions/submitJobApplication'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utilities/ui'

type FormValues = {
  fullName: string
  email: string
  phone: string
  position?: string
  experience: string
  additionalLink?: string
}

type Labels = {
  triggerLabel: string
  title: string
  subtitle: string
  fullName: string
  email: string
  phone: string
  position: string
  positionPlaceholder?: string
  experience: string
  additionalLink: string
  additionalLinkPlaceholder: string
  additionalLinkHint: string
  cv: string
  cvHint: string
  cvAttached: string
  cvChange: string
  submit: string
  submitting: string
  successTitle: string
  successBody: string
  close: string
  required: string
}

type Props = {
  jobId?: string
  jobTitle?: string
  labels: Labels
  className?: string
  triggerClassName?: string
  trigger?: React.ReactNode
}

const ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const MAX_BYTES = 10 * 1024 * 1024

export function JobApplyModal({
  jobId,
  jobTitle,
  labels,
  className,
  triggerClassName,
  trigger,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvError, setCvError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isGeneral = !jobId

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>()

  function resetAll() {
    reset()
    setCvFile(null)
    setCvError(null)
    setSubmitError(null)
    setSuccess(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleOpenChange(open: boolean) {
    onOpenChange()
    if (!open) {
      setTimeout(resetAll, 200)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setCvError(null)
    if (!file) {
      setCvFile(null)
      return
    }
    if (file.size > MAX_BYTES) {
      setCvError(labels.cvHint)
      setCvFile(null)
      e.target.value = ''
      return
    }
    setCvFile(file)
  }

  function onSubmit(values: FormValues) {
    setSubmitError(null)
    if (!cvFile) {
      setCvError(labels.cvHint)
      return
    }

    const formData = new FormData()
    if (jobId) formData.set('jobId', jobId)
    formData.set('fullName', values.fullName)
    formData.set('email', values.email)
    formData.set('phone', values.phone)
    formData.set('experience', values.experience ?? '')
    if (isGeneral) formData.set('position', values.position ?? '')
    if (values.additionalLink) formData.set('additionalLink', values.additionalLink)
    formData.set('cv', cvFile)

    startTransition(async () => {
      const result = await submitJobApplication(formData)
      if (result.ok) {
        setSuccess(true)
      } else {
        if (result.field === 'cv') setCvError(result.error)
        else setSubmitError(result.error)
      }
    })
  }

  return (
    <>
      {trigger ? (
        <button
          type="button"
          className={triggerClassName}
          onClick={onOpen}
          aria-label={labels.triggerLabel}
        >
          {trigger}
        </button>
      ) : (
        <Button className={className} size="lg" onClick={onOpen}>
          {labels.triggerLabel}
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
        classNames={{
          backdrop: 'bg-gray-900/70 backdrop-blur-md',
        }}
        isDismissable={!isPending}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {labels.title}
            </span>
            {jobTitle && (
              <span className="text-xl font-semibold text-gray-900">{jobTitle}</span>
            )}
            <span className="text-sm font-normal text-gray-500">{labels.subtitle}</span>
          </ModalHeader>

          {success ? (
            <ModalBody className="py-10">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <IconCheck size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{labels.successTitle}</h3>
                <p className="text-sm text-gray-600 max-w-md">{labels.successBody}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleOpenChange(false)}
                >
                  {labels.close}
                </Button>
              </div>
            </ModalBody>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody className="py-6 space-y-4">
                <div>
                  <Label htmlFor="fullName">
                    {labels.fullName} <RequiredMark />
                  </Label>
                  <Input
                    id="fullName"
                    autoComplete="name"
                    {...register('fullName', { required: true, minLength: 2 })}
                    aria-invalid={!!errors.fullName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">
                      {labels.email} <RequiredMark />
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register('email', {
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      })}
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      {labels.phone} <RequiredMark />
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      {...register('phone', { required: true, minLength: 6 })}
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="position">{labels.position}</Label>
                  {isGeneral ? (
                    <Input
                      id="position"
                      placeholder={labels.positionPlaceholder}
                      {...register('position', { maxLength: 200 })}
                    />
                  ) : (
                    <Input value={jobTitle ?? ''} disabled className="bg-gray-50" />
                  )}
                </div>

                <div>
                  <Label htmlFor="experience">{labels.experience}</Label>
                  <Textarea
                    id="experience"
                    rows={4}
                    {...register('experience', { maxLength: 4000 })}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalLink">{labels.additionalLink}</Label>
                  <Input
                    id="additionalLink"
                    type="url"
                    placeholder={labels.additionalLinkPlaceholder}
                    {...register('additionalLink', {
                      maxLength: 500,
                      pattern: {
                        value: /^https?:\/\//i,
                        message: labels.additionalLinkHint,
                      },
                    })}
                    aria-invalid={!!errors.additionalLink}
                  />
                  <p className="mt-1 text-xs text-gray-500">{labels.additionalLinkHint}</p>
                </div>

                <div>
                  <Label htmlFor="cv">
                    {labels.cv} <RequiredMark />
                  </Label>
                  <CVPicker
                    inputRef={fileInputRef}
                    file={cvFile}
                    onChange={onFileChange}
                    labels={labels}
                  />
                  <p className={cn('mt-1 text-xs', cvError ? 'text-red-600' : 'text-gray-500')}>
                    {cvError ?? labels.cvHint}
                  </p>
                </div>

                {submitError && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-start gap-2">
                    <IconX size={16} className="mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  {labels.close}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <IconLoader2 size={16} className="animate-spin" />
                      {labels.submitting}
                    </>
                  ) : (
                    labels.submit
                  )}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

function CVPicker({
  inputRef,
  file,
  onChange,
  labels,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  file: File | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  labels: Labels
}) {
  return (
    <div className="mt-1">
      <input
        ref={inputRef}
        id="cv"
        type="file"
        accept={ACCEPT}
        onChange={onChange}
        className="sr-only"
      />
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-md border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 transition-colors px-4 py-6 flex flex-col items-center gap-2 text-gray-500"
        >
          <IconPaperclip size={20} />
          <span className="text-sm">{labels.cv}</span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <IconFile size={18} className="text-primary shrink-0" />
            <span className="text-sm text-gray-700 truncate">{file.name}</span>
            <span className="text-xs text-gray-400 shrink-0">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs text-primary hover:underline shrink-0"
          >
            {labels.cvChange}
          </button>
        </div>
      )}
    </div>
  )
}

function RequiredMark() {
  return <span className="text-red-500" aria-hidden>*</span>
}
