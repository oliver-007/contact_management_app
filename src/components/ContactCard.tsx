import { useEffect, useRef, useState } from "react";
import { IContact } from "../types";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { GiTireIronCross } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDeleteContactMutation } from "../RTK/slices/API/cmaApiSlice";
import Loader from "../modals/Loader";
import EditModal from "../modals/EditModal";

interface IContactCardProps {
  singleContact: IContact;
}

const ContactCard: React.FC<IContactCardProps> = ({ singleContact }) => {
  const { name, address, email, avatar, phoneNumber } = singleContact;
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);

  const [
    deleteContactMutation,
    {
      data: deleteContactMutationData,
      error: deleteContactMutationError,
      isLoading: deleteContactMutationLoading,
    },
  ] = useDeleteContactMutation();

  // console.log(
  //   "deleteContactMutationData from ContactCard --------- ",
  //   deleteContactMutationData
  // );

  // console.log(
  //   "deleteContactMutationError from ContactCard _-------- ",
  //   deleteContactMutationError
  // );

  //  -------- CLOSE OPTION-DIV CLICKING ANYWHERE OUTSIDE OPTION-DIV ----------
  useEffect(() => {
    const handleOptionClose = (e: Event) => {
      if (!optionRef?.current?.contains(e.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleOptionClose, {
      passive: true,
    });
    return () => {
      document.addEventListener("mousedown", handleOptionClose);
    };
  }, [optionRef]);

  // ----------- HANDLE CLICK OPTION FUNC -------------
  const handleClickOptions = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowOptions((prevState) => !prevState);
  };

  // --------- HANDLE EDIT CONTACT FUNC ----------
  const handleEditContact = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowModal(true);
    setShowOptions(false);
  };

  // -------- HANDLE DELETE CONTACT FUNC ----------
  const handleDeleteContact = async (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();

    await deleteContactMutation(singleContact._id);
    setShowOptions(false);
    window.location.reload();
  };

  return (
    <div className="flex items-center shadow-md shadow-pink-400 rounded-md px-3 sm:px-10  py-3 gap-x-5 max-w-[900px] relative ">
      <img
        src={avatar}
        alt="name"
        className=" size-[90px] shrink-0 rounded-full "
      />

      <div className="">
        <p>{name}</p>
        <p> {email} </p>
        <p>{phoneNumber}</p>
        <p>{address}</p>
      </div>

      {/* ---------- OPTION DOTS & OPTIONS ------------ */}
      <div className="absolute right-3 top-3 ">
        <div
          ref={optionRef}
          onClick={(e) => handleClickOptions(e)}
          className="hover:bg-black/30 size-8 p-1 flex items-center justify-center rounded-full hover:text-white duration-200 relative "
        >
          <button type="button" className=" ">
            {showOptions ? (
              <GiTireIronCross className="text-rose-500 size-3 md:size-4 " />
            ) : (
              <PiDotsThreeOutlineVerticalFill />
            )}
          </button>

          {showOptions && (
            <div className="absolute right-10 w-[200px] bg-zinc-800 rounded-md p-2 text-white text-sm capitalize ">
              {/* ------- SAVE TO PLAYLIST OPTION ------- */}
              <p
                className="flex items-center gap-x-2 hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer "
                onClick={(e) => handleEditContact(e)}
              >
                <span>
                  <CiEdit />
                </span>
                Edit
              </p>
              <p
                className="flex items-center gap-x-2 hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer "
                onClick={(e) => handleDeleteContact(e)}
              >
                <span>
                  <RiDeleteBinLine />
                </span>
                Delete
              </p>
            </div>
          )}
        </div>
      </div>

      {deleteContactMutationLoading && (
        <Loader isLoading={deleteContactMutationLoading} />
      )}

      {showModal && (
        <EditModal
          singleContact={singleContact}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default ContactCard;