import { useState, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  LinkIcon,
  XIcon,
  CameraIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import Avatar from "../components/Avatar";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setFormState({ ...formState, profilePic: urlInput.trim() });
    setShowUrlInput(false);
    setUrlInput("");
    toast.success("Profile picture updated!");
  };

  const handleRemovePic = () => {
    setFormState({ ...formState, profilePic: "" });
    setShowUrlInput(false);
    toast.success("Profile picture removed");
  };

  // Handle local file upload - convert to base64 so it can be stored
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large. Please pick an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState({ ...formState, profilePic: reader.result });
      toast.success("Photo uploaded!");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* PROFILE PIC EDITOR */}
            <div className="flex flex-col items-center gap-4">

              {/* Avatar Preview */}
              <div className="relative">
                <Avatar
                  src={formState.profilePic}
                  alt={formState.fullName || "User"}
                  size="3xl"
                  className="ring-4 ring-base-300 ring-offset-2 ring-offset-base-200"
                />
                {/* Remove button only visible when a pic is set */}
                {formState.profilePic && (
                  <button
                    type="button"
                    onClick={handleRemovePic}
                    className="absolute -top-1 -right-1 btn btn-error btn-circle btn-xs shadow-lg"
                    title="Remove photo"
                  >
                    <XIcon className="size-3" />
                  </button>
                )}
              </div>

              {/* Edit Options */}
              <div className="flex flex-wrap gap-2 justify-center">
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {/* Upload from device */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline btn-sm gap-2"
                >
                  <CameraIcon className="size-4" />
                  Upload Photo
                </button>

                {/* Use image URL */}
                <button
                  type="button"
                  onClick={() => setShowUrlInput((v) => !v)}
                  className="btn btn-outline btn-sm gap-2"
                >
                  <LinkIcon className="size-4" />
                  {showUrlInput ? "Cancel" : "Use Image URL"}
                </button>
              </div>

              {/* URL Input shown on toggle */}
              {showUrlInput && (
                <div className="w-full flex gap-2 items-center animate-in slide-in-from-top-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlSubmit())}
                    className="input input-bordered flex-1 text-sm"
                    placeholder="https://example.com/your-photo.jpg"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleUrlSubmit}
                    className="btn btn-primary btn-sm"
                    disabled={!urlInput.trim()}
                  >
                    Apply
                  </button>
                </div>
              )}

              <p className="text-xs opacity-50 text-center">
                You can skip this — your initials will be used as your avatar
              </p>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({ ...formState, learningLanguage: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you are learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;

