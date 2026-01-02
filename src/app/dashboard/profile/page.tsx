"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Shield, Mail, Lock } from "lucide-react";
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
  icon?: React.ReactNode;
  children: React.ReactNode;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  canSave?: boolean;
}> = ({
  title,
  icon,
  children,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  isSaving = false,
  canSave = true,
}) => (
  <Card className="bg-white border border-brand-indigo/10 shadow-sm rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between border-b border-brand-indigo/5 pb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-xl bg-brand-green/10">
            {icon}
          </div>
        )}
        <CardTitle className="text-lg font-semibold text-brand-indigo font-inter">
          {title}
        </CardTitle>
      </div>
      {isEditing ? (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-brand-indigo/50 hover:text-brand-indigo hover:bg-brand-indigo/5 rounded-lg"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            className="bg-brand-green hover:bg-brand-green/90 text-white font-medium rounded-lg"
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
            className="text-brand-indigo/50 hover:text-brand-green hover:bg-brand-green/5 rounded-lg"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        )
      )}
    </CardHeader>
    <CardContent className="pt-6">{children}</CardContent>
  </Card>
);

const InfoItem: React.FC<{
  label: string;
  value: string | undefined | null;
  isLoading: boolean;
}> = ({ label, value, isLoading }) => (
  <div>
    <p className="text-xs font-medium text-brand-indigo/50 mb-1.5 font-dm-sans uppercase tracking-wide">{label}</p>
    {isLoading ? (
      <Skeleton className="h-5 w-3/4 bg-brand-indigo/5" />
    ) : (
      <p className="text-sm text-brand-indigo font-dm-sans font-medium">{value || "N/A"}</p>
    )}
  </div>
);

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-indigo font-inter">
          My Profile
        </h1>
        <p className="text-brand-indigo/60 font-dm-sans mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-gradient-to-br from-brand-green/10 to-brand-indigo/5 border border-brand-indigo/10 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="flex items-center gap-5 py-6">
          {isLoading ? (
            <Skeleton className="h-20 w-20 rounded-full bg-brand-indigo/10" />
          ) : (
            <Avatar className="h-20 w-20 text-2xl border-4 border-white shadow-md">
              <AvatarImage src={userInfo?.profile_url} alt="User profile" />
              <AvatarFallback className="bg-brand-green text-white font-semibold font-inter">
                {userInfo
                  ? getInitials(userInfo.first_name, userInfo.last_name)
                  : "--"}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <>
                <Skeleton className="h-7 w-48 mb-2 bg-brand-indigo/10" />
                <Skeleton className="h-4 w-32 bg-brand-indigo/10" />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-brand-indigo font-inter truncate">
                  {`${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`}
                </h2>
                <p className="text-sm text-brand-indigo/50 font-dm-sans">
                  Member since{" "}
                  {userInfo?.created_at
                    ? format(new Date(userInfo.created_at), "MMMM yyyy")
                    : "N/A"}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {isEditingPersonalInfo ? (
              <>
                <nameForm.Field
                  name="first_name"
                  children={(field) => (
                    <div className="relative">
                      <label
                        htmlFor={field.name}
                        className="text-xs font-medium text-brand-indigo/50 mb-1.5 block font-dm-sans uppercase tracking-wide"
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
                          "h-11 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green rounded-xl font-dm-sans",
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
                        className="text-xs font-medium text-brand-indigo/50 mb-1.5 block font-dm-sans uppercase tracking-wide"
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
                          "h-11 bg-brand-indigo/5 border-brand-indigo/20 text-brand-indigo placeholder:text-brand-indigo/40 focus:border-brand-green rounded-xl font-dm-sans",
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
              label="Email Address"
              value={userInfo?.email}
              isLoading={isLoading}
            />
          </div>
        </form>
      </ProfileSectionCard>

      {/* Security Section */}
      <ProfileSectionCard 
        title="Security" 
        icon={<Shield className="h-5 w-5 text-brand-green" />}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white">
                <Mail className="h-4 w-4 text-brand-indigo/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-indigo font-dm-sans">Email</p>
                <p className="text-xs text-brand-indigo/50 font-dm-sans">
                  Update your email address
                </p>
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-28 bg-brand-indigo/10" />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo/5 rounded-lg font-dm-sans"
                onClick={() => toast.info("Feature coming soon!")}
              >
                Change
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white">
                <Lock className="h-4 w-4 text-brand-indigo/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-indigo font-dm-sans">Password</p>
                <p className="text-xs text-brand-indigo/50 font-dm-sans">
                  Update your password
                </p>
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-9 w-28 bg-brand-indigo/10" />
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo/5 rounded-lg font-dm-sans"
                onClick={() => toast.info("Feature coming soon!")}
              >
                Change
              </Button>
            )}
          </div>
        </div>
      </ProfileSectionCard>
    </div>
  );
}
