import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../RTK/store/store";
import { setMessage } from "../RTK/slices/respMessageSlice";
import { CSSTransition } from "react-transition-group";

const DisplayMessage = () => {
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const dispatch = useAppDispatch();
  const [showMessage, setShowMessage] = useState(false);

  // Show message when there's a new response
  useEffect(() => {
    if (responseMessage) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false); // Start hiding the message after 5 seconds
        dispatch(setMessage(""));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [responseMessage, dispatch]);

  return (
    <CSSTransition
      in={showMessage}
      timeout={300}
      classNames={{
        enter: "opacity-0 -translate-x-full", // Initial state before the transition starts
        enterActive: "opacity-100 translate-x-0 transition-all duration-300", // State when the element is transitioning in
        exit: "opacity-100 translate-x-0", // Final state before the exit transition starts
        exitActive: "opacity-0 -translate-x-full transition-all duration-300", // State when the element is transitioning out
      }}
      unmountOnExit
    >
      <div className={` bottom-10 left-6 fixed z-50 `}>
        <div
          className={`flex items-center bg-zinc-800 text-yellow-400 dark:bg-yellow-400 dark:text-zinc-800 rounded-lg px-3 py-2 text-[11px] font-semibold sm:text-base gap-x-6 `}
        >
          <p className=""> {responseMessage} </p>
        </div>
      </div>
    </CSSTransition>
  );
};

export default DisplayMessage;
