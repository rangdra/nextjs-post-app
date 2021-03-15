const ButtonForm = ({ children }) => {
  return (
    <button
      type="submit"
      className="effect bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-lg hover:bg-none hover:from-indigo-700 hover:to-indigo-500 transition-all duration-200 px-8 py-2 text-gray-50 focus:outline-none rounded-full focus:ring focus:ring-blue-600 focus:ring-opacity-50 w-full"
    >
      {children}
    </button>
  );
};

const ButtonSquare = ({ children, onClick }) => {
  return (
    <button
      className="effect bg-indigo-600 mt-4 transition-all duration-200 shadow px-4 py-2 text-gray-50 hover:bg-indigo-700 focus:outline-none"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { ButtonForm, ButtonSquare };
