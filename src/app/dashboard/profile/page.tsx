"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { UpdateNameSchema } from "@/api/schema/auth";
import { toast } from "sonner";
import { formatError } from "@/common/utils";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) ?? ""}${
    lastName?.charAt(0) ?? ""
  }`.toUpperCase();
};

const ProfileSectionCard: React.FC<{
  title: string;
  children: React.ReactNode;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  canSave?: boolean;
}> = ({
  title,
  children,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  isSaving = false,
  canSave = true,
}) => (
  <Card className="bg-gray-900/60 border-gray-700 text-gray-100 shadow-lg backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700 pb-3">
      <CardTitle className="text-lg font-semibold text-gray-200">
        {title}
      </CardTitle>
      {isEditing ? (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-100 hover:bg-gray-800"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onSave}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            disabled={isSaving || !canSave}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : (
        onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-gray-400 hover:text-cyan-400 hover:bg-gray-800"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        )
      )}
    </CardHeader>
    <CardContent className="">{children}</CardContent>
  </Card>
);

const InfoItem: React.FC<{
  label: string;
  value: string | undefined | null;
  isLoading: boolean;
}> = ({ label, value, isLoading }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    {isLoading ? (
      <Skeleton className="h-5 w-3/4 bg-gray-700" />
    ) : (
      <p className="text-sm text-gray-100">{value || "N/A"}</p>
    )}
  </div>
);

// Helper for form field errors
function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.errors.length > 0 ? (
        <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
    </>
  );
}

export default function ProfilePage() {
  const { user, isLoading, update: updateAuthUser } = useAuth();
  const userInfo = user?.user_info;
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);

  // Mutation for updating name
  const updateNameMutation = useMutation({
    mutationFn: authApi.updateName,
    onSuccess: (data) => {
      updateAuthUser(data);
      toast.success("Name updated successfully!");
      setIsEditingPersonalInfo(false);
    },
    onError: (error: any) => {
      toast.error(formatError(error));
    },
  });

  // Form for personal info edit
  const nameForm = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
    },
    onSubmit: async ({ value }) => {
      if (updateNameMutation.isPending) return;
      updateNameMutation.mutate({
        first_name: value.first_name || "",
        last_name: value.last_name || "",
      });
    },
    validators: {
      onChange: (opts) => {
        try {
          UpdateNameSchema.validateSync(opts.value, { abortEarly: false });
          return undefined;
        } catch (error: any) {
          const errors = error.inner.reduce(
            (acc: Record<string, string[]>, currentError: any) => {
              if (currentError.path) {
                acc[currentError.path] = [
                  ...(acc[currentError.path] || []),
                  currentError.message,
                ];
              } else if (currentError.message.includes("At least one")) {
                acc["_error"] = [
                  ...(acc["_error"] || []),
                  currentError.message,
                ];
              }
              return acc;
            },
            {}
          );
          return errors;
        }
      },
    },
  });

  useEffect(() => {
    if (userInfo) {
      nameForm.setFieldValue("first_name", userInfo.first_name || "");
      nameForm.setFieldValue("last_name", userInfo.last_name || "");
    }
  }, [userInfo, nameForm]); // Keep nameForm dependency for safety

  const handlePersonalInfoEdit = () => {
    if (userInfo) {
      nameForm.setFieldValue("first_name", userInfo.first_name || "");
      nameForm.setFieldValue("last_name", userInfo.last_name || "");
    }
    setIsEditingPersonalInfo(true);
  };

  const handlePersonalInfoCancel = () => {
    if (userInfo) {
      nameForm.setFieldValue("first_name", userInfo.first_name || "");
      nameForm.setFieldValue("last_name", userInfo.last_name || "");
    }
    nameForm.reset();
    setIsEditingPersonalInfo(false);
  };

  const handlePersonalInfoSave = () => {
    nameForm.handleSubmit();
  };

  const handleChangePassword = () => console.log("Change Password clicked");

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-100 mb-6">My Profile</h1>

      <Card className="bg-gray-900/60 border-gray-700 text-gray-100 shadow-lg backdrop-blur-sm">
        <CardContent className="flex items-center space-x-4">
          {isLoading ? (
            <Skeleton className="h-16 w-16 rounded-full bg-gray-700" />
          ) : (
            <Avatar className="h-16 w-16 text-xl">
              <AvatarImage src={userInfo?.profile_url} alt="User profile" />
              <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-teal-600 text-white font-semibold">
                {userInfo
                  ? getInitials(userInfo.first_name, userInfo.last_name)
                  : "--"}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-40 mb-1 bg-gray-700" />
                <Skeleton className="h-4 w-32 bg-gray-700" />
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-50">
                  {`${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`}
                </h2>
                <p className="text-sm text-gray-400">
                  Member since{" "}
                  {userInfo?.created_at
                    ? format(new Date(userInfo.created_at), "MMM yyyy")
                    : "N/A"}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <ProfileSectionCard
        title="Personal Information"
        isEditing={isEditingPersonalInfo}
        onEdit={handlePersonalInfoEdit}
        onCancel={handlePersonalInfoCancel}
        onSave={handlePersonalInfoSave}
        isSaving={updateNameMutation.isPending}
        canSave={nameForm.state.canSubmit && nameForm.state.isDirty}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePersonalInfoSave();
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            {isEditingPersonalInfo ? (
              <>
                <nameForm.Field
                  name="first_name"
                  children={(field) => (
                    <div className="relative">
                      <label
                        htmlFor={field.name}
                        className="text-xs font-medium text-gray-500 mb-1 block"
                      >
                        First Name
                      </label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500",
                          field.state.meta.errors.length > 0 &&
                            "border-red-500 focus:border-red-500"
                        )}
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
                <nameForm.Field
                  name="last_name"
                  children={(field) => (
                    <div className="relative">
                      <label
                        htmlFor={field.name}
                        className="text-xs font-medium text-gray-500 mb-1 block"
                      >
                        Last Name
                      </label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-cyan-500",
                          field.state.meta.errors.length > 0 &&
                            "border-red-500 focus:border-red-500"
                        )}
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
              </>
            ) : (
              <>
                <InfoItem
                  label="First Name"
                  value={userInfo?.first_name}
                  isLoading={isLoading}
                />
                <InfoItem
                  label="Last Name"
                  value={userInfo?.last_name}
                  isLoading={isLoading}
                />
              </>
            )}
            <InfoItem
              label="Email address"
              value={userInfo?.email}
              isLoading={isLoading}
            />
          </div>
        </form>
      </ProfileSectionCard>

      <ProfileSectionCard title="Security">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Email</p>
              <p className="text-xs text-gray-400">
                Update your email address.
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-32 bg-gray-700" />
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 text-gray-300"
                onClick={() => toast.info("Feature coming soon!")}
              >
                Change Email
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Password</p>
              <p className="text-xs text-gray-400">Update your password.</p>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-32 bg-gray-700" />
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 text-gray-300"
                onClick={() => toast.info("Feature coming soon!")}
              >
                Change Password
              </Button>
            )}
          </div>
        </div>
      </ProfileSectionCard>
    </div>
  );
}
