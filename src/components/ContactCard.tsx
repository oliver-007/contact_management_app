import { useEffect, useRef, useState } from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { GiTireIronCross } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrDrag } from "react-icons/gr";

import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { IContact } from "../types";
import {
  useDeleteContactMutation,
  useFavoriteToggleMutation,
} from "../RTK/slices/API/cmaApiSlice";
import Loader from "../modals/Loader";
import EditModal from "../modals/EditModal";
import { useAppDispatch } from "../RTK/store/store";
import { setMessage } from "../RTK/slices/respMessageSlice";

interface IContactCardProps {
  singleContact: IContact;
}

const ContactCard: React.FC<IContactCardProps> = ({ singleContact }) => {
  const { name, address, email, avatar, phoneNumber } = singleContact;
  const [showOptions, setShowOptions] = useState(false);
  const [favState, setFavState] = useState(singleContact.isFavorite);
  const [showModal, setShowModal] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: singleContact._id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // console.log("singleContact", singleContact);

  // ---------- FAVORITE-TOGGLE RTK-MUTATION HOOK --------------
  const [
    favoriteToggleMutation,
    { data: favoriteToggleMutationData, error: favoriteToggleMutationError },
  ] = useFavoriteToggleMutation();

  // console.log(favoriteToggleMutationData);

  // ------------ SET RESPONSE MESSAGE OF  favoriteToggleMutation() -------------
  useEffect(() => {
    favoriteToggleMutationData &&
      dispatch(setMessage(favoriteToggleMutationData.message));

    favoriteToggleMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          favoriteToggleMutationError.data.message
        )
      );
  }, [favoriteToggleMutationData, favoriteToggleMutationError]);

  // ----------- DELETE RTK-MUTATION HOOK -----------
  const [
    deleteContactMutation,
    {
      data: deleteContactMutationData,
      error: deleteContactMutationError,
      isLoading: deleteContactMutationLoading,
    },
  ] = useDeleteContactMutation();

  // -------- SET DELETE RESPONSE MESSAGE ---------
  useEffect(() => {
    deleteContactMutationData &&
      dispatch(setMessage(deleteContactMutationData.message));

    deleteContactMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          deleteContactMutationError.data.message
        )
      );
  }, [deleteContactMutationData, deleteContactMutationError]);

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
    const timer = setTimeout(() => {
      window.location.reload();
    }, 6000);
    return () => clearTimeout(timer);
  };

  // ---------- HANDLE FAVORITE-TOGGLE FUNC ------------
  const handleFavoriteToggle = async () => {
    setFavState((prevState) => !prevState);
    await favoriteToggleMutation(singleContact._id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col items-center justify-center w-full sm:flex-row sm:justify-start shadow-md shadow-pink-400 rounded-md px-3 sm:px-10 max-w-[700px] py-3 gap-y-5 sm:gap-x-5 relative touch-none"
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="cursor-move p-1 absolute -left-8 "
      >
        <GrDrag />
      </button>

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

      {/* --------- FAVORITE TOGGLE ICON ---------- */}
      <div
        onClick={handleFavoriteToggle}
        className="absolute right-3 sm:bottom-3 top-16 size-8 flex items-center justify-center    duration-300 rounded-full  p-1 cursor-pointer "
      >
        {favState ? <MdFavorite /> : <MdFavoriteBorder />}
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
