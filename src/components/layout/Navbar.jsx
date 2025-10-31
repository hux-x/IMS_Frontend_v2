import { useState, useContext, useEffect } from "react";
import { Bell, Menu, Search, User, X } from "lucide-react";
import { AuthContext } from "@/context/authContext";
import authService from "@/apis/services/authService";
import EditProfileModal from "@/components/modals/EditProfileModal";

const NavProfile = ({ logout, user, onEditClick }) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
      <button
        onClick={onEditClick}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        Edit Profile
      </button>
      <button
        onClick={logout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </div>
  );
};

const Header = ({ onMenuClick = () => {} }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { name, email, logout } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    try {
      const res = await authService.getUserInfo();
      if (res && res.data) {
        setUserInfo(res.data.employee);
        console.log(res.data.employee, "USER INFO");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const user = {
    name,
    email,
  };

  const handleEditClick = () => {
    setShowProfile(false);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = () => {
    getUserInfo(); // Refresh user info after update
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-64 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#acc6aa] flex items-center justify-center">
                  {userInfo?.profile_picture_url ? (
                    <img
                      src={userInfo.profile_picture_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  )}
                </div>

                <span className="hidden md:block text-sm font-medium">
                  {user?.name}
                </span>
              </button>

              {showProfile && (
                <NavProfile
                  logout={logout}
                  user={user}
                  onEditClick={handleEditClick}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userInfo={userInfo}
        onUpdate={handleUpdateSuccess}
      />

      {/* Spacer to retain layout flow */}
      <div className="h-[72px]"></div>
    </>
  );
};

export default Header;
