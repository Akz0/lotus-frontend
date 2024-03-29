import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsBagCheckFill, BsCartPlus, BsDash, BsPlus } from "react-icons/bs";
import { useRecoilState } from "recoil";
import { useQuery } from "urql";
import { CartItemsSelector, CartMenuAtom } from "../../atoms";
import FullPageLoading from "../../components/FullPageLoading";
import { GET_PRODUCT_QUERY } from "../../lib/query";

function ProductPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useRecoilState(CartItemsSelector);
  const [cartMenu, setCartMenu] = useRecoilState(CartMenuAtom);
  const [existsInCart, setExistsInCart] = useState(false);
  useEffect(() => {
    let flag = false;
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].slug === slug) {
        setExistsInCart(true);
        flag = true;
      }
    }

    if (!flag) {
      setExistsInCart(false);
    }
  }, [cartItems]);

  const increaseQuantity = () => setQuantity((prevQ) => prevQ + 1);
  const decreaseQuantity = () =>
    setQuantity((prevQ) => (prevQ > 1 ? prevQ - 1 : 1));

  const slug = router.query?.slug;
  const [results] = useQuery({
    query: GET_PRODUCT_QUERY,
    variables: { slug: `${slug}` },
  });
  const { data, fetching, error } = results;

  if (fetching) {
    return <FullPageLoading />;
  }
  if (error) {
    return <>Error</>;
  }

  const product = data?.products?.data[0]?.attributes;
  const imageUrls = product?.images?.data?.map((image) => {
    return image?.attributes?.formats?.large?.url;
  });
  const firstImage = imageUrls?.splice(0, 1);

  const BuyNow = () => {
    if (!existsInCart) {
      setCartItems({
        slug,
        quantity,
        title: product.title,
        price: product.price,
        image: firstImage[0],
      });
    }
    setCartMenu(false);
  };

  const AddToCart = () => {
    if (existsInCart) {
      setCartMenu((prevState) => !prevState);
      return;
    }
    setCartItems({
      slug,
      quantity,
      title: product.title,
      price: product.price,
      image: firstImage[0],
    });

    toast(
      <div>
        <div>
          <span className="text-pink">{product.title}</span> added to your cart!
        </div>
      </div>,
      {
        position: "bottom-left",
        duration: 1500,
        style: {
          style: {
            border: "2px solid rgb(251,46,134)",
            padding: "12px",
          },
        },
      }
    );
  };

  return (
    <div>
      <Head>
        <title>{product?.title}</title>
        <meta name="description" content={product?.description} />
      </Head>
      <main>
        <div className="productDetails">
          <div className="flex flex-col w-[100%] lg:w-[60%]">
            <h3 className="productDetails-Title">{product?.title}</h3>
            <div className="productDetails-Image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="productDetails-Image__main"
                src={firstImage ? firstImage[0] : ""}
                alt=""
              />
            </div>
          </div>

          <div className="productActions">
            <h2 className="text-2xl text-purple">₹.{product?.price}</h2>
            <p className="productDetails-Description ">
              {product?.description}
            </p>
            <div className="productActions-Quantity">
              <span>Quantity</span>
              <div className="flex gap-3 w-[50%] lg:w-[40%] justify-between items-center">
                <button className="btn-outline" onClick={decreaseQuantity}>
                  <BsDash className="text-xl" />
                </button>

                <span>{quantity}</span>
                <button className="btn-outline" onClick={increaseQuantity}>
                  <BsPlus className="text-xl" />
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full justify-between items-center md:flex-row lg:justify-start lg:gap-10">
              <button
                className="productActions-Button btn-outline w-full md:w-auto"
                onClick={BuyNow}
              >
                <BsBagCheckFill className="text-2xl md:text-lg" />
                Buy Now
              </button>
              <button
                className="productActions-Button btn  w-full  md:w-auto"
                onClick={AddToCart}
              >
                <BsCartPlus className="text-2xl md:text-lg" />
                {existsInCart ? `Added to Cart` : `Add To Cart`}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductPage;
