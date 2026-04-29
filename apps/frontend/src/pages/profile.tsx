import "../App.css";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Profile() {
    const [isEditing, setIsEditing] = useState(false);

    const [user, setUser] = useState({
        firstname: "John",
        lastname: "Doe",
        username: "johndoe",
        password: "password",
        email: "johndoe@example.com",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <h1 className="text-primary text-2xl font-semibold">
                Edit Profile
            </h1>

            <div className="px-10 py-20">
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div>
                            <label className="text-sm font-medium">
                                First Name
                            </label>
                            <Input
                                name="Firstname"
                                value={user.firstname}
                                onChange={handleChange}
                                disabled={true}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Last Name
                            </label>
                            <Input
                                name="Lastname"
                                value={user.lastname}
                                onChange={handleChange}
                                disabled={true}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Username
                            </label>
                            <Input
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="mt-1"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={() => setIsEditing(false)}>
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default Profile;
