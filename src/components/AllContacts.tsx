import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import { useGetAllContactsQuery } from "../RTK/slices/API/cmaApiSlice";
import ripple from "../assets/Ripple.svg";
import { IContact } from "../types";
import ContactCard from "./ContactCard";
import { setMessage } from "../RTK/slices/respMessageSlice";
import { useAppDispatch, useAppSelector } from "../RTK/store/store";
import DisplayMessage from "./DisplayMessage";

const AllContacts = () => {
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const dispatch = useAppDispatch();
  const [allContacts, setAllContacts] = useState<IContact[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // console.log("allContacts ----------", allContacts);

  // ------- GET ALL-CONTACTS RTK-QUERY HOOK --------
  const {
    data: getAllContactsQueryData,
    error: getAllContactsQueryError,
    isLoading: getAllContactsQueryLoading,
  } = useGetAllContactsQuery(null);

  // ---------- SET ALL CONTACTS ----------
  useEffect(() => {
    getAllContactsQueryData &&
      getAllContactsQueryData.data &&
      setAllContacts(getAllContactsQueryData.data.allContacts);
  }, [getAllContactsQueryData]);

  // -------- SET RESPONSE MESSAGE OF getAllContactsQueryData ---------
  useEffect(() => {
    getAllContactsQueryError &&
      dispatch(
        setMessage(
          // @ts-ignore
          getAllContactsQueryError.data.message
        )
      );
  }, [getAllContactsQueryError]);

  // Handle Drag End: Reorder the items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find the index of the dragged item and the item it was dropped over

      const getContactIndex = (cId: any) =>
        allContacts.findIndex((singleContact) => singleContact._id === cId);

      const oldIndex = getContactIndex(active.id);
      const newIndex = getContactIndex(over.id);

      // Reorder the list using `arrayMove`
      setAllContacts((items) => arrayMove(items, oldIndex, newIndex));
    } else return;
  };

  return (
    <div className="px-5 w-full flex flex-col items-center justify-center ">
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
        allContacts.length > 0 ? (
        // The portion which will be choose as drag & drop parent div , has to wrap with <DndContext>
        <DndContext
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="px-16 py-5 border h-[calc(100vh-120px)] overflow-auto border-zinc-300 rounded-md space-y-5  ">
            <SortableContext
              items={allContacts.map((singleContact) => singleContact._id)}
              strategy={verticalListSortingStrategy}
            >
              {allContacts.map((singleContact: IContact) => (
                <ContactCard
                  key={singleContact._id}
                  singleContact={singleContact}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
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
