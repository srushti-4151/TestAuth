import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCateThunk,
  deleteCateThunk,
  getCateThunk,
  updateCateThunk,
} from "../redux/CatSlice";

const ManagerDashboad = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cate);
  const [editId, setEditId] = useState(null);

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   formState: { errors },
  // } = useForm();

  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm();

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("cat form data: ", data);
    const res = dispatch(addCateThunk(data));
    if (!res) {
      alert("error");
      return;
    }
    alert("cateory added successfully !");
    resetAdd();
    return;
  };

  useEffect(() => {
    dispatch(getCateThunk());
  }, []);

  const handleEdit = async (cat) => {
    setEditId(cat._id);
    setEditValue("name", cat.name);
    setEditValue("description", cat.description);
  };

  const handleUpdate = async (editId, data) => {
    console.log("updaate cate data:", data);
    console.log("editId cate :", editId);

    const res = await dispatch(updateCateThunk({ id: editId, data }));
    if (!res) {
      alert("error");
      return;
    }
    alert("cate updated");
    setEditId(null);
    dispatch(getCateThunk());
    resetEdit();
    return;
  };

  const handleDelete = async (cateId) => {
    const res = await dispatch(deleteCateThunk(cateId));
    if (!res) {
      return;
    }
    dispatch(getCateThunk());
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>ManagerDashboad</h2>

      <table className="w-auto m-auto">
        <thead>
          <tr className="border">
            <th className="border">Name</th>
            <th className="border">Description</th>
            <th className="border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((cat) => (
            <tr key={cat._id} className="border">
              {editId === cat._id ? (
                <>
                  <td className="p-2 border">
                    <input
                      {...editRegister("name", {
                        required: "name is required",
                      })}
                    />
                    {editErrors?.name && (
                      <p className="text-red-600 text-xs">
                        {editErrors.name.message}
                      </p>
                    )}
                  </td>
                  <td className="p-2 border">
                    <input
                      {...editRegister("description", {
                        required: "Description is required",
                      })}
                    />
                    {editErrors?.description && (
                      <p className="text-red-600 text-xs">
                        {editErrors.description.message}
                      </p>
                    )}
                  </td>
                  <td className="p-2 border">
                    <button
                      className="p-2 bg-blue-300 mr-2"
                      onClick={handleEditSubmit((data) =>
                        handleUpdate(editId, data)
                      )}
                    >
                      Save
                    </button>
                    <button
                      className="p-2 bg-red-300"
                      onClick={() => {
                        setEditId(null);
                        resetEdit();
                      }}
                    >
                      Calcel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">{cat.name}</td>
                  <td className="p-2 border">{cat.description}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(cat._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <form
        onSubmit={handleAddSubmit(onSubmit)}
        className="w-80 m-auto mt-10 p-5 border border-gray-500 flex flex-col justify-center items-center gap-3"
      >
        <h2 className="w-full text-lg flex justify-center"> category form </h2>
        <input
          {...addRegister("name", { required: "Category name is required" })}
          placeholder="Enter ategory name"
          className="border border-black p-2 w-full"
        />
        {addErrors.name && (
          <p className="text-red-700 text-sm">{addErrors.name.message}</p>
        )}

        <input
          {...addRegister("description", {
            required: "Description is required",
          })}
          placeholder="Description"
          className="border border-black p-2 w-full"
        />
        {addErrors.description && (
          <p className="text-red-700 text-sm">
            {addErrors.description.message}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1.5 rounded"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default ManagerDashboad;
