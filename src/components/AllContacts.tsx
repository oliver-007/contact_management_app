import { useEffect } from "react";
import { useGetAllContactsQuery } from "../RTK/slices/API/cmaApiSlice";
import { useAppDispatch, useAppSelector } from "../RTK/store/store";
import ripple from "../assets/Ripple.svg";
import { IContact } from "../types";
import ContactCard from "./ContactCard";
import { setMessage } from "../RTK/slices/respMessageSlice";
import DisplayMessage from "./DisplayMessage";

const AllContacts = () => {
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const dispatch = useAppDispatch();

  const {
    data: getAllContactsQueryData,
    error: getAllContactsQueryError,
    isLoading: getAllContactsQueryLoading,
  } = useGetAllContactsQuery(null);

  // console.log(
  //   "getAllContactsQueryData from AllContacts -------- ",
  //   getAllContactsQueryData
  // );
  // console.log(
  //   "getAllContactsQueryError from AllContacts ----- ",
  //   getAllContactsQueryError
  // );

  // -------- SET RESPONSE MESSAGE OF getAllContactsQueryData ---------
  useEffect(() => {
    getAllContactsQueryData &&
      dispatch(setMessage(getAllContactsQueryData.message));

    getAllContactsQueryError &&
      dispatch(
        setMessage(
          // @ts-ignore
          getAllContactsQueryError.data.message
        )
      );
  }, [getAllContactsQueryData, getAllContactsQueryError]);

  return (
    <div className="space-y-5 px-5 ">
      <div className="flex items-center justify-center my-5 gap-x-5 rounded-md ">
        <h3 className="text-zinc-700 font-semibold text-lg tracking-widest ">
          All Contacts
        </h3>

        <h3 className="text-sky-500 font-bold ">
          (
          {getAllContactsQueryData &&
            getAllContactsQueryData.data.totalContacts}
          )
        </h3>
      </div>

      {getAllContactsQueryError ? (
        <div>
          {
            // @ts-ignore
            getAllContactsQueryError.data.message
          }
        </div>
      ) : getAllContactsQueryLoading ? (
        <div>
          <img src={ripple} alt="ripple" />
        </div>
      ) : getAllContactsQueryData &&
        getAllContactsQueryData.data &&
        getAllContactsQueryData.data.allContacts.length > 0 ? (
        getAllContactsQueryData.data.allContacts.map(
          (singleContact: IContact) => (
            <ContactCard
              key={singleContact._id}
              singleContact={singleContact}
            />
          )
        )
      ) : (
        <div>
          <h3 className="italic"> no contact found </h3>
        </div>
      )}

      {responseMessage && <DisplayMessage />}
    </div>
  );
};

export default AllContacts;
