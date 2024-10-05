import React, { useEffect, useRef, useState } from "react";

function Home() {
  const productsRef = useRef([]);
  const nameRef = useRef();
  const priceRef = useRef();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch("https://auth-rg69.onrender.com/api/products/private/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Server responded with error!");
      })
      .then((data) => {
        productsRef.current = data;
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const createProduct = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const newProduct = {
      name: nameRef.current.value,
      price: priceRef.current.value,
    };

    fetch("https://auth-rg69.onrender.com/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          productsRef.current = [...productsRef.current, data];
          setProducts([...productsRef.current]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    nameRef.current.value = "";
    priceRef.current.value = "";
  };

  function handleDel(id) {
    const token = localStorage.getItem('token');
  
    const con = window.confirm("Maxsulotni ochirishni tasdiqlang !!!");
    if (con) {
      fetch(`https://auth-rg69.onrender.com/api/products/private/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Mahsulot muvoffaqqiyatli o'chirildi") {
            const updatedProducts = productsRef.current.filter(
              (product) => product.id !== id
            );
            productsRef.current = updatedProducts;
            setProducts(updatedProducts);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <form
        className="flex flex-col gap-4 w-1/3 p-5 rounded-md mx-auto mt-5 mb-5 bg-slate-200"
        onSubmit={createProduct}
      >
        <div>
          <input
            className="border border-gray-300 rounded-md p-3 w-full"
            type="text"
            ref={nameRef}
            placeholder="Product Name"
            required
          />
        </div>
        <div>
          <input
            className="border border-gray-300 rounded-md p-3 w-full"
            type="number"
            ref={priceRef}
            placeholder="Product Price"
            required
          />
        </div>
        <button className="btn rounded-md bg-green-700 text-white p-3 w-full" type="submit">
          Add Product
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-12">
        {products.length > 0 &&
          products.map((product, index) => (
            <div
              className="w-1/4 px-5 h-32 bg-green-300 border border-gray-300 rounded-md flex flex-col justify-center items-center shadow-md "
              key={index}
            >
              <h1 className="text-xl font-semibold">{product.name}</h1>
              <h3 className="text-lg text-gray-500">${product.price}</h3>
              <button
                onClick={() => handleDel(product.id)}
                className="bg-red-700 text-white rounded-md p-2 mt-2 cursor-pointer"
              >
                delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;
