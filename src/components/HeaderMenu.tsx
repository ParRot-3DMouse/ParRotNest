import { FilePlus2, Heart, Keyboard, UserRound } from "lucide-react";
import { css } from "../../styled-system/css";
import Link from "next/link";

const headerContainer = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 2rem",
  backgroundColor: "#2b2727",
  borderBottom: "1px solid #606060",
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
  width: "100px",
  textDecoration: "none",
  transition: "color 0.3s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  fontSize: "15px",
  _hover: {
    // color: "teal.400",
  },
});

export const HeaderMenu: React.FC = () => {
  return (
    <header className={headerContainer}>
      <div className={appName}>ParRotNest</div>
      <nav className={navLinks}>
        <Link href="/keymap/new" className={linkStyle}>
          <FilePlus2 size={28} />
          <p>New Keymap</p>
        </Link>
        <Link href="/keymap" className={linkStyle}>
          <Keyboard size={28} />
          <p>Keymaps</p>
        </Link>
        <Link href="/likes" className={linkStyle}>
          <Heart size={28} />
          <p>Likes</p>
        </Link>
        <Link href="/mypage" className={linkStyle}>
          <UserRound size={28} />
          <p>MyPage</p>
        </Link>
      </nav>
    </header>
  );
};
