"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit } from "lucide-react";
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
  <Card className="bg-brand-indigo/15 border-brand-indigo/40 text-white shadow-lg backdrop-blur-sm rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between border-b border-brand-indigo/30 pb-3">
      <CardTitle className="text-lg font-semibold text-white font-inter">
        {title}
      </CardTitle>
      {isEditing ? (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-white/50 hover:text-white hover:bg-brand-indigo/30"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onSave}
            className="bg-brand-green hover:bg-brand-green/90 text-brand-black font-medium"
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
            className="text-white/50 hover:text-brand-green hover:bg-brand-indigo/30"
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
    <p className="text-xs font-medium text-white/40 mb-1 font-dm-sans">{label}</p>
    {isLoading ? (
      <Skeleton className="h-5 w-3/4 bg-brand-indigo/40" />
    ) : (
      <p className="text-sm text-white font-dm-sans">{value || "N/A"}</p>
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
  }, [userInfo, nameForm]);

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

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold text-white mb-6 font-inter">My Profile</h1>

      <Card className="bg-brand-indigo/15 border-brand-indigo/40 text-white shadow-lg backdrop-blur-sm rounded-2xl">
        <CardContent className="flex items-center space-x-4 pt-6">
          {isLoading ? (
            <Skeleton className="h-16 w-16 rounded-full bg-brand-indigo/40" />
          ) : (
            <Avatar className="h-16 w-16 text-xl">
              <AvatarImage src={userInfo?.profile_url} alt="User profile" />
              <AvatarFallback className="bg-brand-green/20 text-brand-green font-semibold font-inter">
                {userInfo
                  ? getInitials(userInfo.first_name, userInfo.last_name)
                  : "--"}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-40 mb-1 bg-brand-indigo/40" />
                <Skeleton className="h-4 w-32 bg-brand-indigo/40" />
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-white font-inter">
                  {`${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`}
                </h2>
                <p className="text-sm text-white/50 font-dm-sans">
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
                        className="text-xs font-medium text-white/40 mb-1 block font-dm-sans"
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
                          "bg-brand-indigo/30 border-brand-indigo/60 text-white placeholder:text-white/40 focus:border-brand-green rounded-xl font-dm-sans",
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
                        className="text-xs font-medium text-white/40 mb-1 block font-dm-sans"
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
                          "bg-brand-indigo/30 border-brand-indigo/60 text-white placeholder:text-white/40 focus:border-brand-green rounded-xl font-dm-sans",
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
              <p className="text-sm font-medium text-white font-dm-sans">Email</p>
              <p className="text-xs text-white/40 font-dm-sans">
                Update your email address.
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-32 bg-brand-indigo/40" />
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="bg-brand-indigo/40 hover:bg-brand-indigo/60 text-white/80 rounded-xl font-dm-sans"
                onClick={() => toast.info("Feature coming soon!")}
              >
                Change Email
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white font-dm-sans">Password</p>
              <p className="text-xs text-white/40 font-dm-sans">Update your password.</p>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-32 bg-brand-indigo/40" />
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="bg-brand-indigo/40 hover:bg-brand-indigo/60 text-white/80 rounded-xl font-dm-sans"
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
