import { css } from "../../styled-system/css";
import Link from "next/link";

const headerContainer = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 2rem",
  backgroundColor: "#2c2c2c",
  color: "white",
  borderBottom: "1px solid gray",
  position: "sticky",
  top: "0",
  zIndex: "1000",
});

const appName = css({
  fontSize: "1.5rem",
  fontWeight: "bold",
});

const navLinks = css({
  display: "flex",
  gap: "1.5rem",
  fontSize: "1rem",
});

const linkStyle = css({
  color: "white",
  textDecoration: "none",
  transition: "color 0.3s",
  _hover: {
    color: "teal.400",
  },
});

export const HeaderMenu: React.FC = () => {
  return (
    <header className={headerContainer}>
      <div className={appName}>ParRotNest</div>
      <nav className={navLinks}>
        <Link href="/keymap/new" className={linkStyle}>
          New Keymap
        </Link>
        <Link href="/keymap" className={linkStyle}>
          Keymaps
        </Link>
        <Link href="/likes" className={linkStyle}>
          Likes
        </Link>
        <Link href="/mypage" className={linkStyle}>
          MyPage
        </Link>
      </nav>
    </header>
  );
};
