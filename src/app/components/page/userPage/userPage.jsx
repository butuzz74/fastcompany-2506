import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import UserCard from "../../ui/userCard";
import QualitiesCard from "../../ui/qualitiesCard";
import MeetingsCard from "../../ui/meetingsCard";
import Comments from "../../ui/comments";
import { useUser } from "../../../hooks/useUsers";
import { CommentsProvider } from "../../../hooks/useComments";
import { useAuth } from "../../../hooks/useAuth";

const UserPage = ({ userId }) => {
    const { currentUser } = useAuth();
    const { getUserById } = useUser();
    const [user, setUser] = useState();
    useEffect(() => {
        setUser(getUserById(userId));
    }, [userId]);
    const userEdit =
        currentUser._id === userId ? { ...currentUser } : { ...user };

    if (user && currentUser) {
        return (
            <div className="container">
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <UserCard user={userEdit} />
                        <QualitiesCard data={userEdit.qualities} />
                        <MeetingsCard value={userEdit.completedMeetings} />
                    </div>
                    <div className="col-md-8">
                        <CommentsProvider>
                            <Comments />
                        </CommentsProvider>
                    </div>
                </div>
            </div>
        );
    } else {
        return <h1>Loading</h1>;
    }
};

UserPage.propTypes = {
    userId: PropTypes.string.isRequired
};

export default UserPage;
