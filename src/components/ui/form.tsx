import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  Path,
  PathValue,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form'
import Editor from '@/components/Editor'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { z, ZodType } from 'zod'
import { Input } from './input'
import { Switch } from './switch'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectSeparator,
} from './select'
import { Button } from './button'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Calendar } from './calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(
        'text-sm font-medium text-destructive flex flex-row gap-1 animate-in slide-in-from-left  items-center',
        className
      )}
      {...props}
    >
      <FontAwesomeIcon
        className="inline-flex"
        size={'xs'}
        icon={faCircleInfo}
      />
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export type VariableData = {
  label: string
  description: string
  disabled?: boolean
} & (
  | {
      type: 'text' | 'boolean' | 'date' | 'file' | 'content' | 'hidden'
    }
  | {
      type: 'options'
      options: {
        label: string
        value: string
      }[]
    }
)

export type FormDetailsType<T extends ZodType> = Record<
  keyof z.infer<T>,
  VariableData
>

export function generateForm<T extends ZodType>({
  defaultValues,
  formDetails,
  form,
  onSubmit,
  style,
}: {
  defaultValues?: z.infer<T>
  formDetails: Record<keyof z.infer<T>, VariableData>
  form: UseFormReturn<z.infer<T>>
  style?: 'grid' | 'column'
  onSubmit: any
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`grid grid-cols-1 ${
          style === 'column' ? '' : 'lg:grid-cols-3'
        } gap-4 items-center`}
      >
        {Object.entries(formDetails).map(([key, variable]) => {
          return (
            <FormField
              key={key}
              control={form.control}
              name={key as Path<T>}
              render={({ field }) => {
                switch (variable.type) {
                  case 'text': {
                    const { value, ...rest } = field
                    return (
                      <FormItem className="col-span-full lg:col-span-1">
                        <FormLabel>{variable.label}</FormLabel>
                        <FormControl>
                          <Input
                            disabled={variable.disabled}
                            value={value ?? ''}
                            {...rest}
                          />
                        </FormControl>
                        <FormDescription>
                          {variable.description}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }
                  case 'boolean': {
                    return (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.value}
                            disabled={variable.disabled}
                            onCheckedChange={(checked) =>
                              form.setValue(
                                key as Path<T>,
                                checked as PathValue<T, Path<T>>
                              )
                            }
                            id={key}
                          />
                          <Label htmlFor={key}>{variable.label}</Label>
                        </div>
                        <FormDescription>
                          {' '}
                          {variable.description}{' '}
                        </FormDescription>
                      </div>
                    )
                  }
                  case 'options': {
                    return (
                      <div className="space-y-2">
                        <FormLabel>{variable.label}</FormLabel>
                        <Select
                          disabled={variable.disabled}
                          value={field.value}
                          onValueChange={(e) =>
                            form.setValue(
                              key as Path<T>,
                              e as PathValue<T, Path<T>>
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {
                                variable.options.find(
                                  (option) => option.value === field.value
                                )?.label
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {variable.options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {variable.description}
                        </FormDescription>
                      </div>
                    )
                  }
                  case 'date': {
                    return (
                      <FormItem className="flex flex-col gap-2 self-center">
                        <FormLabel>{variable.label}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={variable.disabled}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          {variable.description}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }
                  case 'file': {
                    return (
                      <FormItem className="col-span-full lg:col-span-1">
                        <FormLabel>{variable.label}</FormLabel>
                        <FormControl>
                          <Input
                            disabled={variable.disabled}
                            onChange={(event) => {
                              if (!event) return
                              form.setValue(
                                key as Path<T>,
                                event.target.files![0] as PathValue<T, Path<T>>
                              )
                            }}
                            type={'file'}
                          />
                        </FormControl>
                        <FormDescription>
                          {variable.description}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )
                  }
                  case 'content': {
                    return (
                      <Editor
                        initialValue={field.value ?? ''}
                        onChange={(value: string) =>
                          form.setValue(
                            key as Path<T>,
                            value as PathValue<T, Path<T>>
                          )
                        }
                      />
                    )
                  }
                  case 'hidden': {
                    return <></>
                  }
                  default: {
                    return <Input {...field} />
                  }
                }
              }}
            />
          )
        })}
        <Button variant={'destructive'} type="submit" className="col-span-full">
          Save
        </Button>
      </form>
    </Form>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
