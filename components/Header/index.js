import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import { MdExitToApp, MdOutlineShoppingCart } from "react-icons/md";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  CartCountSelector,
  CartItemsAtom,
  CartMenuAtom,
  sideMenuAtom,
} from "../../atoms";

const getCartFromLocal = () => {
  const data = localStorage.getItem("cartItems");
  return data ? JSON.parse(data) : [];
};

import Cart from "../Cart";
function Header() {
  const router = useRouter();
  const [sideMenu, setSideMenu] = useRecoilState(sideMenuAtom);
  const [cartMenu, setCartMenu] = useRecoilState(CartMenuAtom);
  const [cartItems, setCartItems] = useRecoilState(CartItemsAtom);
  const cartCount = useRecoilValue(CartCountSelector);

  const { user } = useUser();
  const isLoggedIn = user ? true : false;

  useEffect(() => {
    setCartItems(getCartFromLocal());
  }, []);

  const toggleSideMenu = () => {
    if (sideMenu) {
      setSideMenu(false);
    } else {
      setSideMenu(true);
    }
  };

  const closeSideMenu = () => {
    setSideMenu(false);
  };

  const renderActions = () => {
    return (
      <div className="hidden md:flex items-center space-x-3 ">
        <div className="flex justify-between items-center gap-1">
          <div
            className="cart"
            onClick={() => setCartMenu((prevState) => !prevState)}
          >
            <MdOutlineShoppingCart />
            {cartCount > 0 ? (
              <span
                className="absolute right-2 -top-2 rounded-full bg-red-600 
                      w-5 h-5 top right p-0 m-0 text-white font-mono text-sm  
                      leading-tight text-center border bg-red"
              >
                {cartCount}
              </span>
            ) : (
              ""
            )}
          </div>
          {isLoggedIn ? renderLoggedIn() : renderGuest()}
        </div>
      </div>
    );
  };
  const renderSideMenuBar = () => {
    return (
      <div
        className={`mobile-menu ${
          !sideMenu ? `translate-x-[0%]` : "translate-x-[-100%]"
        } side-menu-mobile`}
      >
        <div className="mb-4 px-2">
          <Link href="/">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src="https://res.cloudinary.com/lachakeom/image/upload/v1655788317/logo_gp9rxv.png"
              width={100}
              height={20}
              className="cursor-pointer object-contain min-w-[100px] min-h-[20px] sm:hidden "
              alt="Lotus Wear Logo"
              onClick={closeSideMenu}
            />
          </Link>
        </div>

        {isLoggedIn && (
          <>
            <div className="px-3 text-xl font-light font-josan">
              Hello <span className="font-bold font-lato">{user.name}</span>
            </div>
            <ul className="">
              <li>
                <Link href="/profile/settings">
                  <p
                    className="header-nav-link cursor-pointer !text-purple"
                    onClick={closeSideMenu}
                  >
                    Settings
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/profile/orders">
                  <p
                    className="header-nav-link cursor-pointer !text-purple"
                    onClick={closeSideMenu}
                  >
                    My Orders
                  </p>
                </Link>
              </li>

              <li>
                <Link href="/profile/wishlist">
                  <p
                    className="header-nav-link cursor-pointer !text-purple"
                    onClick={closeSideMenu}
                  >
                    Wishlist
                  </p>
                </Link>
              </li>

              <li>
                <Link href="/api/auth/logout">
                  <p
                    onClick={closeSideMenu}
                    className="!text-purple header-nav-link flex justify-start items-center gap-3 cursor-pointer "
                  >
                    <MdExitToApp /> Sign Out
                  </p>
                </Link>
              </li>
            </ul>

            <hr className="h-0 my-2 border border-solid border-t-0 border-gray-700 opacity-25" />
          </>
        )}
        <Link href="/">
          <p className="header-nav-link cursor-pointer" onClick={closeSideMenu}>
            Home
          </p>
        </Link>

        <Link href="/about">
          <p className="header-nav-link cursor-pointer" onClick={closeSideMenu}>
            About
          </p>
        </Link>

        <Link href="/contact">
          <p className="header-nav-link cursor-pointer" onClick={closeSideMenu}>
            Contact
          </p>
        </Link>

        <Link href="/support">
          <p className="header-nav-link cursor-pointer" onClick={closeSideMenu}>
            Support
          </p>
        </Link>

        {!isLoggedIn && (
          <div className="flex flex-col gap-5">
            <Link href={"/api/auth/login"}>
              <div className="btn-outline !shadow-none text-sm">Sign In</div>
            </Link>

            <Link href={"/api/auth/login"}>
              <div className="btn text-sm">Sign Up</div>
            </Link>
          </div>
        )}
      </div>
    );
  };

  const renderHamburgerIcon = () => {
    return (
      <div className="md:hidden flex items-center justify-between">
        <div
          className="cart"
          onClick={() => setCartMenu((prevState) => !prevState)}
        >
          <MdOutlineShoppingCart />
          {cartCount > 0 ? (
            <span
              className="absolute right-2 -top-2 rounded-full bg-red-600 
                      w-5 h-5 top right p-0 m-0 text-white font-mono text-sm  
                      leading-tight text-center border bg-red"
            >
              {cartCount}
            </span>
          ) : (
            ""
          )}
        </div>

        <div
          className="md:hidden flex items-center rounded-full px-2 py-2
      text-purple md:hover:text-purple md:hover:bg-light-purple/50 
      active:hover:text-purple active:bg-light-purple/50"
          onClick={toggleSideMenu}
        >
          <button className="outline-none mobile-menu-button">
            <svg
              className=" w-6 h-6  active:bg-transparent"
              x-show="!showMenu"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderNavLinks = () => {
    return (
      <div className="flex space-x-7 justify-start items-center">
        <div className="w-full h-full ">
          <Link href="/">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src="https://res.cloudinary.com/lachakeom/image/upload/v1655788317/logo_gp9rxv.png"
              width={200}
              height={40}
              className="cursor-pointer object-contain min-w-[200px] min-h-[40px] hidden sm:flex "
              alt="Lotus Wear Logo"
            />
          </Link>
        </div>

        <Link href={"/"}>
          <div className="w-full h-full  flex sm:hidden ">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src="https://res.cloudinary.com/lachakeom/image/upload/v1655883074/logoIcon_wok4uu.png"
              width={50}
              height={20}
              className="cursor-pointerobject-contain min-w-[50px] min-h-[20px] cursor-pointer"
              alt="Lotus Wear Logo"
            />
          </div>
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          <Link href="/">
            <p className="header-nav-link cursor-pointer">Home</p>
          </Link>

          <Link href="/about">
            <p className="header-nav-link cursor-pointer">About</p>
          </Link>

          <Link href="/contact">
            <p className="header-nav-link cursor-pointer">Contact</p>
          </Link>

          <Link href="/support">
            <p className="header-nav-link cursor-pointer">Support</p>
          </Link>
        </div>
      </div>
    );
  };

  const renderGuest = () => {
    return (
      <div className="flex justify-between items-center gap-2">
        <Link href={"/api/auth/login"}>
          <div className="btn-outline !border-none !shadow-none text-sm">
            Sign In
          </div>
        </Link>

        <Link href={"/api/auth/login"}>
          <div className="btn text-sm hidden lg:flex">Sign Up</div>
        </Link>
      </div>
    );
  };

  const renderLoggedIn = () => {
    return (
      <div className="dropdown relative">
        <button
          className="profileButton"
          type="button"
          id="dropdownMenuMediumButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Hello <span className="w-[60%] overflow-hidden">{user.name}</span>
          <span>
            <FaAngleDown />
          </span>
        </button>
        <ul
          className=" dropdown-menu profileOptionsList"
          aria-labelledby="dropdownMenuMediumButton"
        >
          <li>
            <Link href="/profile/settings">
              <p className="dropdown-item profileOption">Settings</p>
            </Link>
          </li>
          <li>
            <Link href="/profile/orders">
              <p className="dropdown-item profileOption">My Orders</p>
            </Link>
          </li>

          <li>
            <Link href="/profile/wishlist">
              <p className="dropdown-item profileOption">Wishlist</p>
            </Link>
          </li>

          <li>
            <Link href="/api/auth/logout">
              <p className="dropdown-item profileOption hover:text-purple">
                <MdExitToApp /> Sign Out
              </p>
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const renderCart = () => {
    return <Cart />;
  };

  return (
    <div>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <header>
        <div className="flex justify-between items-center w-full">
          {/* NavLink */}
          {renderNavLinks()}
          {/* Actions */}
          {renderActions()}
          {/* Menu Button */}
          {renderHamburgerIcon()}
          {/* Cart */}
          {renderCart()}
        </div>

        {/* Sidebar Mobile Menu */}
        {renderSideMenuBar()}
      </header>
    </div>
  );
}

export default Header;
