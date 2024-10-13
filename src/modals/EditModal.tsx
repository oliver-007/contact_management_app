import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ContactForm from "../components/ContactForm";
import { IContact } from "../types";

interface IEditModalProps {
  singleContact: IContact;
  showModal: boolean;
  setShowModal: (props: boolean) => void;
}

const EditModal: React.FC<IEditModalProps> = ({
  showModal,
  singleContact,
  setShowModal,
}) => {
  const editRef = useRef<HTMLDivElement>(null);

  //   ------- CLOSING MODAL FUNC CLICKING ANYWHERE OUTSIDE MAIN DIV ---------
  useEffect(() => {
    const handleModalClose = (e: MouseEvent) => {
      editRef.current &&
        !editRef.current.contains(e.target as Node) &&
        setShowModal(false);
    };

    window.addEventListener("mousedown", handleModalClose, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleModalClose);
    };
  }, []);

  return createPortal(
    <div
      className={`bg-black bg-opacity-70 fixed inset-0 flex justify-center items-center z-30 duration-500  ${
        showModal ? "scale-100 opacity-100 " : "scale-0 opacity-0"
      } `}
    >
      {/* ------ MAIN DIV ------ */}
      <div ref={editRef} className=" flex items-center justify-center ">
        <ContactForm
          singleContact={singleContact}
          setShowModal={setShowModal}
        />
      </div>
    </div>,
    document.getElementById("editModal")!
  );
};

export default EditModal;
