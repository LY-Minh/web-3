"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, FolderKanban, LogOut, Settings } from "lucide-react";
import { useStudentProfile } from "./student-profile-context";

type Props = {
  classNames: {
    profileMenuWrap: string;
    userBoxButton: string;
    userAvatar: string;
    profileDropdown: string;
    profileDropdownItem: string;
  };
};

export default function StudentProfileMenu({ classNames }: Props) {
  const { profile } = useStudentProfile();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={classNames.profileMenuWrap} ref={profileMenuRef}>
      <button
        type="button"
        className={classNames.userBoxButton}
        onClick={() => setShowProfileMenu((prev) => !prev)}
      >
        <img
          src={profile.profileImage}
          alt={profile.fullName}
          className={classNames.userAvatar}
        />
        <span>{profile.fullName}</span>
        <ChevronDown size={18} />
      </button>

      {showProfileMenu && (
        <div className={classNames.profileDropdown}>
          <Link
            href="/student/account_setting"
            className={classNames.profileDropdownItem}
            onClick={() => setShowProfileMenu(false)}
          >
            <Settings size={16} />
            <span>Account Settings</span>
          </Link>

          <Link
            href="/student/my-claims"
            className={classNames.profileDropdownItem}
            onClick={() => setShowProfileMenu(false)}
          >
            <FolderKanban size={16} />
            <span>My Claims</span>
          </Link>

          <Link
            href="/"
            className={classNames.profileDropdownItem}
            onClick={() => setShowProfileMenu(false)}
          >
            <FolderKanban size={16} />
            <span>Log out</span>
          </Link>
        </div>
      )}
    </div>
  );
}
