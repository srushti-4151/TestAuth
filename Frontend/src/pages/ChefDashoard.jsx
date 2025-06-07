import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addDishThunk,
  getdish,
  removeDish,
  updateDish,
} from "../redux/DishSlice.js";
import { getCateThunk } from "../redux/CatSlice.js";
import { useForm } from "react-hook-form";

const ChefDashoard = () => {
  const dispatch = useDispatch();
  const { dishes, loading } = useSelector((state) => state.dish);
  const { items } = useSelector((state) => state.cate);
  const [editId, seteditId] = useState(null);

  useEffect(() => {
    dispatch(getdish());
    dispatch(getCateThunk());
  }, []);

  const {
    register: addRegister,
    reset: resetAdd,
    handleSubmit: handleAddSubmit,
    formState: { errors: addErrors },
  } = useForm();

  const {
    register: editRegister,
    reset: resetEdit,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    formState: { errors: EditErrors },
  } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("isAvailable", data.isAvailable);
    formData.append("category", data.category);
    formData.append("imageUrl", data.imageUrl[0]);

    const res = dispatch(addDishThunk(formData));
    if (!res) {
      console.log("error");
      return;
    }
    alert("added!");
    resetAdd();
    return;
  };

  const handleEdit = async (dish) => {
    seteditId(dish._id);
    setEditValue("name", dish.name);
    setEditValue("description", dish.description);
    setEditValue("price", dish.price);
    setEditValue("imageUrl", dish.imageUrl);
    setEditValue("isAvailable", dish.isAvailable);
    setEditValue("category", dish.category);
  };

  const handleUpdate = async (editId, data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("isAvailable", data.isAvailable);
    formData.append("category", data.category);

    // Only add image if a new one is selected
    if (data.imageUrl && data.imageUrl[0]) {
      formData.append("imageUrl", data.imageUrl[0]);
    }

    const res = await dispatch(updateDish({ dishId: editId, data: formData }));
    if (!res) {
      alert("error");
      return;
    }
    alert("dish updated");
    seteditId(null);
    dispatch(getdish());
    resetEdit();
  };

  const handleDelete = async (dishId) => {
    const res = await dispatch(removeDish(dishId));
    if (!res) {
      return;
    }
    dispatch(getdish());
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>ChefDashoard</div>

      {dishes && (
        <table className="w-full border text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Available</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish._id} className="border">
                {editId === dish._id ? (
                  <>
                    <td className="p-2 border">
                      <input
                        type="file"
                        className="border border-black p-2 w-full mb-1"
                        accept="image/png, image/jpeg"
                        {...editRegister("imageUrl", {
                          required: "Image file is required",
                        })}
                      />
                      {EditErrors.imageUrl && (
                        <p className="text-red-700 text-sm">
                          {EditErrors.imageUrl.message}
                        </p>
                      )}
                    </td>
                    <td className="p-2 border">
                      <input
                        className="border border-black p-2 w-full mb-1"
                        {...editRegister("name", {
                          required: "Dish name is required",
                        })}
                      />
                      {EditErrors.name && (
                        <p className="text-red-700 text-sm">
                          {EditErrors.name.message}
                        </p>
                      )}
                    </td>

                    <td className="p-2 border">
                      <input
                        className="border border-black p-2 w-full mb-1"
                        {...editRegister("description", {
                          required: "description is required",
                        })}
                      />
                      {EditErrors.description && (
                        <p className="text-red-700 text-sm">
                          {EditErrors.description.message}
                        </p>
                      )}
                    </td>

                    <td className="p-2 border">
                      <input
                        className="border border-black p-2 w-full mb-1"
                        type="number"
                        {...editRegister("price", {
                          required: "price is required",
                        })}
                      />
                      {EditErrors.price && (
                        <p className="text-red-700 text-sm">
                          {EditErrors.price.message}
                        </p>
                      )}
                    </td>

                    <td className="p-2 border">
                      <select
                        className="border border-black p-1 mb-1"
                        {...editRegister("category", {
                          required: "Category is required",
                        })}
                      >
                        {items.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {EditErrors.category && (
                        <p className="text-red-700 text-sm">
                          {EditErrors.category.message}
                        </p>
                      )}
                    </td>

                    <td className="p-2 border">
                      <select
                        {...editRegister("isAvailable")}
                        className="border border-black p-1 mb-1"
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                    </td>

                    <td>
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
                          seteditId(null);
                          resetEdit();
                        }}
                      >
                        Calcel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-20 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-2 border">{dish.name}</td>
                    <td className="p-2 border">{dish.description}</td>
                    <td className="p-2 border">₹{dish.price}</td>
                    <td className="p-2 border">
                      {/* <select
                  value={dish.category}
                  disabled
                  className="border p-1 rounded"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select> */}{" "}
                      {dish.category}
                    </td>
                    <td className="p-2 border">
                      {dish.isAvailable ? "✅" : "❌"}
                    </td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(dish)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dish._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
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

      <form
        onSubmit={handleAddSubmit(onSubmit)}
        className="flex flex-col justify-center items-start border border-gray-600 p-4 max-w-96 mx-auto"
      >
        <label>Name</label>
        <input
          className="border border-black p-2 w-full mb-1"
          {...addRegister("name", { required: "Dish name is required" })}
        />
        {addErrors.name && (
          <p className="text-red-700 text-sm">{addErrors.name.message}</p>
        )}

        <label>Description</label>
        <input
          className="border border-black p-2 w-full mb-1"
          {...addRegister("description", {
            required: "description is required",
          })}
        />
        {addErrors.description && (
          <p className="text-red-700 text-sm">
            {addErrors.description.message}
          </p>
        )}

        <label>price</label>
        <input
          className="border border-black p-2 w-full mb-1"
          type="number"
          {...addRegister("price", { required: "price is required" })}
        />
        {addErrors.price && (
          <p className="text-red-700 text-sm">{addErrors.price.message}</p>
        )}
        <label>Image</label>
        <input
          type="file"
          className="border border-black p-2 w-full mb-1"
          accept="image/png, image/jpeg"
          {...addRegister("imageUrl", {
            required: "Image file is required",
          })}
        />
        {addErrors.imageUrl && (
          <p className="text-red-700 text-sm">{addErrors.imageUrl.message}</p>
        )}

        <label>Is Available</label>
        <select
          {...addRegister("isAvailable")}
          className="border border-black p-1 mb-1"
        >
          <option value={true}>Available</option>
          <option value={false}>Not Available</option>
        </select>

        <label>Category</label>
        <select
          className="border border-black p-1 mb-1"
          {...addRegister("category", { required: "Category is required" })}
        >
          <option value="">Select category</option>
          {items.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {addErrors.category && (
          <p className="text-red-700 text-sm">{addErrors.category.message}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default ChefDashoard;
