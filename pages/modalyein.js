import Modal from "components/Modal";
import React from "react";

const ModalYein = () => {
  return (
    <Modal content={(toggle) => <img src="/login2.jpg" />}>
      {(toggle) => (
        <span onClick={toggle} className="">
          Klik
        </span>
      )}
    </Modal>
  );
};

export default ModalYein;
