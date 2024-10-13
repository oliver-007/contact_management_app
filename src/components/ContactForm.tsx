import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import DisplayMessage from "./DisplayMessage";
import { useAppDispatch, useAppSelector } from "../RTK/store/store";
import {
  useCreateContactMutation,
  useUpdateContactInfoMutation,
} from "../RTK/slices/API/cmaApiSlice";
import { setMessage } from "../RTK/slices/respMessageSlice";
import Loader from "../modals/Loader";
import { IContact, IFormInput } from "../types";

interface IContactFormProps {
  singleContact?: IContact;
  setShowModal?: (porps: boolean) => void;
}

const ContactForm: React.FC<IContactFormProps> = ({
  singleContact,
  setShowModal,
}) => {
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const dispatch = useAppDispatch();
  const cId = singleContact && singleContact._id;

  // --------- CREATE CONTACT RTK-MUTATION HOOK ----------
  const [
    createContactMutation,
    {
      data: createContactMutationData,
      error: createContactMutationError,
      isLoading: createContactMutationLoading,
    },
  ] = useCreateContactMutation();

  // console.log("createContactMutationData ", createContactMutationData);
  // console.log("createContactMutationError ", createContactMutationError);

  // -------- UPDATE CONTACT RTK-MUTATION HOOK ----------
  const [
    updateContactInfoMutation,
    {
      data: updateContactInfoMutationData,
      error: updateContactInfoMutationError,
      isLoading: updateContactInfoMutationLoading,
    },
  ] = useUpdateContactInfoMutation();

  console.log(
    "updateContactInfoMutationData from ContactForm -------- ",
    updateContactInfoMutationData
  );
  console.log(
    "updateContactInfoMutationError from Contactform --------- ",
    updateContactInfoMutationError
  );

  // ---------- SET RESPONSE MESSAGE OF updateContactInfoMutation  ------------
  useEffect(() => {
    updateContactInfoMutationData &&
      dispatch(setMessage(updateContactInfoMutationData.message));

    updateContactInfoMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          updateContactInfoMutationError.data.message
        )
      );
  }, [updateContactInfoMutationData, updateContactInfoMutationError]);

  //   ---------- SET CREATE-CONTACT-MUTATION RESPONSE MESSAGE ------------
  useEffect(() => {
    createContactMutationData &&
      dispatch(setMessage(createContactMutationData.message));

    createContactMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          createContactMutationError.data.message
        )
      );
  }, [createContactMutationData, createContactMutationError]);

  const defaultValues = {
    avatar: null,
    name: "",
    address: "",
    email: "",
    phoneNumber: "",
  };

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IFormInput>({ defaultValues });

  // ------ SET VALUE TO INPUT FIELDS (EDIT PURPOSE ONLY) -------
  useEffect(() => {
    singleContact &&
      reset({
        name: singleContact.name,
        email: singleContact.email,
        address: singleContact.address,
        phoneNumber: singleContact.phoneNumber,
      });
  }, [singleContact]);

  //   -------- FORM SUBMIT FUNC ---------
  const formSubmit: SubmitHandler<IFormInput> = async (contactData) => {
    const formData = new FormData();
    contactData.avatar && formData.append("avatar", contactData.avatar[0]);

    formData.append("name", contactData.name);
    formData.append("email", contactData.email);
    formData.append("phoneNumber", contactData.phoneNumber);
    formData.append("address", contactData.address);
    singleContact
      ? await updateContactInfoMutation({ formData, cId })
      : await createContactMutation(formData);
  };

  useEffect(() => {
    setFocus("name");
  }, [setFocus, singleContact]);

  useEffect(() => {
    isSubmitSuccessful &&
      (reset(defaultValues), setShowModal && setShowModal(false));
  }, [isSubmitSuccessful, reset, setShowModal]);

  return (
    <div className=" mx-5 flex items-center justify-center">
      <div className="formClass">
        <h1 className=" text-slate-800/70 text-xl font-bold my-4 ">
          Create Contact :
        </h1>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex flex-col gap-3"
        >
          {/* // * ------ NAME --------- */}
          <input
            className="inputClass"
            type="text"
            placeholder="Name...."
            {...register("name", {
              required: {
                value: true,
                message: "* Name is required",
              },
              minLength: {
                value: 3,
                message: "* Name must be more than 3 characters",
              },
            })}
          />
          {errors && <p className="formErrorMessage">{errors.name?.message}</p>}

          {/* --------- USER NAME -------- */}
          <input
            className="inputClass"
            type="text"
            placeholder="Address...."
            {...register("address", {
              required: {
                value: true,
                message: "*Address is required",
              },
            })}
          />
          {errors && (
            <p className="formErrorMessage">{errors.address?.message}</p>
          )}

          {/* ---- PROFILE IMAGE */}
          <div className="sm:ml-5  ">
            <label className="text-slate-500 text-sm px-1  ">
              Profile Image :
            </label>
            <input
              className="inputFileClass"
              id="profile"
              {...register("avatar", {
                required: !singleContact && {
                  value: true,
                  message: "* Profile image is required ",
                },
              })}
              type="file"
            />
            {errors && (
              <p className="formErrorMessage">{errors.avatar?.message}</p>
            )}
          </div>

          {/* // ------ E-MAIL --------- */}
          <input
            className="inputClass"
            type="text"
            placeholder="E-mail"
            {...register("email", {
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "* Invalid mail ",
              },
            })}
          />
          {errors && (
            <p className="formErrorMessage">{errors.email?.message}</p>
          )}

          {/* // ********** // password */}
          <input
            className="inputClass"
            type="text"
            placeholder="Phone Number...."
            {...register("phoneNumber", {
              required: {
                value: true,
                message: "* Phone number is required",
              },
            })}
          />
          {errors && (
            <p className="formErrorMessage">{errors.phoneNumber?.message}</p>
          )}

          <button className="bg-cyan-400 hover:bg-cyan-500 transition-colors duration-300 text-white rounded-b-lg py-2">
            Submit
          </button>
        </form>

        {/* -------- SHOW RESPONSE MESSAGE -------- */}
        {responseMessage && <DisplayMessage />}
      </div>

      {/* ------- LOADER MODAL ------ */}
      {createContactMutationLoading && (
        <Loader
          isLoading={
            createContactMutationLoading || updateContactInfoMutationLoading
          }
        />
      )}
    </div>
  );
};

export default ContactForm;
