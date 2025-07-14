import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCateThunk,
  deleteCateThunk,
  getCateThunk,
  updateCateThunk,
} from "../redux/CatSlice";

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cate);
  const [editId, setEditId] = useState(null);
  const [showAddModel, setShowAddModel] = useState(false);

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

  const onSubmit = async (data) => {
    console.log("cat form data: ", data);

    try {
      await dispatch(addCateThunk(data)).unwrap();
      alert("Category added successfully!");
      resetAdd();
      dispatch(getCateThunk()); 
    } catch (error) {
      console.log("Add category error:", error);
      alert(error?.message || "Failed to add category");
    }
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
    try {
      const res = await dispatch(
        updateCateThunk({ id: editId, data })
      ).unwrap();
      alert("Category updated successfully!");
      setEditId(null);
      resetEdit();
      dispatch(getCateThunk());
    } catch (error) {
      console.log("Update error:", error);
      alert(error?.message || "Failed to update category");
    }
  };

  const handleDelete = async (cateId) => {
    try {
      await dispatch(deleteCateThunk(cateId)).unwrap();
      alert("Category deleted successfully!");
      dispatch(getCateThunk());
    } catch (error) {
      console.log("Delete error:", error);
      alert(error?.message || "Failed to delete category");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>ManagerDashboard</h2>
      <button
        onClick={() => setShowAddModel(true)}
        className="text-red-500 mt-4"
      >
        Add Item
      </button>

      {items && (
        <table className="min-w-96 text-center m-auto">
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
                      <textarea
                        rows={3}
                        className="border border-black max-w-xs p-2 w-full mb-1 resize-none"
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
                    <td className="p-2 border whitespace-pre-line break-words max-w-xs">
                      {cat.description}
                    </td>
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
      )}

      {showAddModel && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-md w-[400px]">
            <form
              onSubmit={handleAddSubmit(onSubmit)}
              className="m-auto mt-10 p-5 border border-gray-500 flex flex-col justify-center items-center gap-3"
            >
              <h2 className="w-full text-lg flex justify-center">
                {" "}
                category form{" "}
              </h2>
              <input
                {...addRegister("name", {
                  required: "Category name is required",
                })}
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
            <button
              onClick={() => setShowAddModel(false)}
              className="text-red-500 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
