
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";

type ProfileHeaderProps = {
  id: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ id }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <PageHeader 
      heading={<T text="Staff Profile" />}
      description={<T text="View and manage staff details" />}
      actions={
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate("/admin/staff")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <T text="Back" />
          </Button>
          <Button 
            onClick={() => navigate(`/admin/staff/edit/${id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            <T text="Edit Profile" />
          </Button>
        </div>
      }
    />
  );
};

export default ProfileHeader;
