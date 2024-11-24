import { DevTool } from '@hookform/devtools';
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form';

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumber: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: 'Batman',
      email: '',
      channel: '',
      social: {
        twitter: '',
        facebook: '',
      },
      phoneNumber: ['', ''],
      phNumbers: [{ number: '' }],
      age: 0,
      dob: new Date(),
    },
    mode: 'onTouched',
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
  } = form;
  const {
    errors,
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    isValidating,
    submitCount,
  } = formState;

  // console.log({ touchedFields, dirtyFields, isDirty });
  console.log({
    submitCount,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    isValidating,
  });
  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control: control,
  });

  const onSubmit = (data: FormValues) => {
    console.log('submit', data);
  };

  const onError = (error: FieldErrors<FormValues>) => {
    console.log('error', error);
  };

  const handleGetValues = () => {
    console.log('get values :', getValues(['username', 'email']));
  };

  const handleSetValues = () => {
    setValue('username', '', {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log(value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const watchUsername = watch();
  // const watchUsername = watch('username');
  // const watchUsername = watch(['username', 'email']);

  renderCount++;

  return (
    <div>
      <h1>YouTube Form ({renderCount / 2})</h1>

      {/* <h2>Watched value: {watchUsername}</h2> */}
      {/* <h2>Watched value: {JSON.stringify(watchUsername)}</h2> */}

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register('username', {
              required: { value: true, message: 'username is required.' },
            })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            id="email"
            {...register('email', {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email format',
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== 'admin@example.com' ||
                    'Enter a different email address'
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith('baddomain.com') ||
                    'This domain is not supported.'
                  );
                },
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email${fieldValue}`,
                  );
                  const data = await response.json();
                  return data.length === 0 || 'Email already exists';
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register('channel', {
              required: { value: true, message: 'channel is required.' },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register('age', {
              valueAsNumber: true,
              required: { value: true, message: 'Age is required.' },
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of birth</label>
          <input
            type="date"
            id="dob"
            {...register('dob', {
              valueAsDate: true,
              required: { value: true, message: 'Date of birth is required.' },
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register('social.twitter', {
              disabled: watch('channel') === '',
            })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="text"
            id="facebook"
            {...register('social.facebook', {})}
          />
        </div>

        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone Number</label>
          <input
            type="text"
            id="primary-phone"
            {...register('phoneNumber.0', {})}
          />
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone Number</label>
          <input
            type="text"
            id="secondary-phone"
            {...register('phoneNumber.1', {})}
          />
        </div>

        <div>
          <label htmlFor="">List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: '' })}>
              Add phone number
            </button>
          </div>
        </div>

        <button type="button" onClick={handleGetValues}>
          Get Values
        </button>
        <button type="button" onClick={handleSetValues}>
          Set Values
        </button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
        <button type="button" onClick={() => trigger()}>
          Validate
        </button>

        <button type="submit" disabled={!isDirty || isSubmitting}>
          Submit
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default YouTubeForm;
