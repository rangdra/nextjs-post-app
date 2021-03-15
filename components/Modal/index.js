import React, { useState, useEffect, useRef } from "react";
import propTypes from "prop-types";
import { createPortal } from "react-dom";

import { CSSTransition } from "react-transition-group";

export default function Modal(props) {
  const [ready, setReady] = useState(() => false);
  const [display, setDisplay] = useState(() => false);
  const [allow, setAllow] = useState(() => true);
  const modalRef = useRef(null);
  const idModal = "modal";

  const toggleAllow = () => {
    setAllow(!allow);
  };

  const toggle = () => {
    if (props.toggleModal) props.toggleModal();
    else setDisplay(!display);
  };

  const handleClickOutside = (e) => {
    if (modalRef?.current && !modalRef?.current?.contains?.(e.target) && allow)
      toggle();
  };

  useEffect(() => {
    const rootContainer = document.createElement("div");
    rootContainer.setAttribute("id", idModal);
    setReady(true);

    if (!document.getElementById(idModal))
      document.body.appendChild(rootContainer);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    if (display || props.in) {
      document.querySelector("body").classList.add("modal-open");
    }
    return () => {
      document.querySelector("body").classList.remove("modal-open");
    };
  }, [display, props.in]);

  if (!ready) return null;

  return (
    <>
      {props.children(toggle)}
      {document && document.getElementById(idModal) && (
        <div>
          {createPortal(
            <CSSTransition
              in={props.in ?? display}
              timeout={500}
              onExit={toggleAllow}
              onExited={toggleAllow}
              classNames="overlay"
              unmountOnExit
            >
              <div className="overlay fixed inset-0 h-screen z-50">
                <div className="bg-gray-900 opacity-25 inset-0 absolute z-10"></div>
                <div className="absolute z-20 flex items-center justify-center inset-0">
                  <div
                    style={(props.modalStyle, { maxHeight: "42rem" })}
                    ref={modalRef}
                    className="bg-white shadow-2xl w-full md:w-auto md:max-w-3xl"
                  >
                    <div className="relative">
                      <span className="modal-close" onClick={toggle}></span>
                    </div>
                    {props.content(toggle)}
                  </div>
                </div>
              </div>
            </CSSTransition>,
            document.getElementById(idModal)
          )}
        </div>
      )}
    </>
  );
}

Modal.defaulProps = {};
Modal.propTypes = {
  in: propTypes.bool,
  toggleModal: propTypes.func,
  content: propTypes.func.isRequired,
};
