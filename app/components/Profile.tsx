'use client'
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getUserProfile } from "../data/auth"
import { getCourses } from "../data/courses"
import { getEntries } from "../data/entries"
import { getShares } from "../data/shares"
import { getLikes } from "../data/likes"





interface Share {
    id: number
    user: User
    shared_to: number
    entry: Entry  | null
    // reading: Reading | null
    course: Course | null
    entry_details: {  
        id: number;
        title: string;
        reflection: string;
        created_at: string;
        updated_at: string;
    }
    course_details: {
        id: number;
        title: string
        description: string
    }
}

interface User {
    id: number
    username: string
    about_me: string
    role: string
    email: string
}

interface Course {
    id: number
    title: string
}

interface Like {
    id: number;
    user: number;  // Changed: user is just the ID
    entry: number; // Changed: entry is just the ID
    created_at: string;
    entry_details: {  // Added: entry_details contains the full entry info
        id: number;
        title: string;
        reflection: string;
        created_at: string;
        updated_at: string;
    }
}

interface Entry {
    id: number
    title: string
}

export default function Profile() {
    const router = useRouter()
    const [likes, setLikes] = useState<Like [] >([])
    const [entries, setEntries] = useState<Entry []>([])
    const [shares, setShares] = useState<Share []>([])
    const [courses, setCourses] = useState<Course []>([])
    const [currentUser, setCurrentUser] = useState<User >()


   useEffect(() => {
    const fetchAllData = async () => {
        try {
            const userResponse = await getUserProfile();
            
            const [likesResponse, entriesResponse, coursesResponse, sharesResponse] = await Promise.all([
                getLikes(),
                getEntries(),
                getCourses(),
                getShares()
            ]);
            
            // Updated filter to compare with the numeric user ID
            const userLikes = likesResponse.filter(like => like.user === userResponse.id);
            const userShares = sharesResponse.filter(share => share.shared_to === userResponse.id)
            setCurrentUser(userResponse);
            setLikes(userLikes || []);
            setEntries(entriesResponse || []);
            setCourses(coursesResponse || []);
            setShares(userShares || []);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    fetchAllData();
}, []);


 return (
  <div className="pixel-container p-5">
    <div className="columns is-multiline">
      {/* Likes - Top Left */}
      <div className="column is-one-quarter">
        <div className="pixel-box">
          <h2 className="pixel-title">❤️ Likes</h2>
          <div className="pixel-content">
            {likes.length > 0 ? likes.map(like => (
              <button
                key={like.id}
                className="pixel-button is-fullwidth mb-2"
                onClick={() => router.push(`/entries/${like.entry}`)}
              >
                {like.entry_details.title}
              </button>
            )) : <p className="pixel-text">No likes yet</p>}
          </div>
        </div>
      </div>

      {/* Profile Info - Center */}
      <div className="column is-half">
        <div className="pixel-box">
          <h1 className="pixel-title">🏰 Profile</h1>
          {currentUser && (
            <div className="pixel-content">
              <div className="pixel-stat">
                <span className="pixel-label">Username:</span>
                <span className="pixel-value">{currentUser.username}</span>
              </div>
              <div className="pixel-stat">
                <span className="pixel-label">Email:</span>
                <span className="pixel-value">{currentUser.email}</span>
              </div>
              <div className="pixel-stat">
                <span className="pixel-label">About Me:</span>
                <span className="pixel-value">{currentUser.about_me}</span>
              </div>
              <div className="pixel-stat">
                <span className="pixel-label">Role:</span>
                <span className="pixel-value">{currentUser.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Courses - Top Right */}
      <div className="column is-one-quarter">
        <div className="pixel-box">
          <h2 className="pixel-title">📜 Courses</h2>
          <div className="pixel-content">
            {courses.length > 0 ? courses.map(course => (
              <button
                key={course.id}
                className="pixel-button is-fullwidth mb-2"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                {course.title}
              </button>
            )) : <p className="pixel-text">No courses yet</p>}
          </div>
        </div>
      </div>

      {/* Shares - Bottom Left */}
      <div className="column is-one-quarter">
        <div className="pixel-box">
          <h2 className="pixel-title">🛡 Shared With Me</h2>
          <div className="pixel-content">
            {shares.length > 0 ? shares.map(share => (
              <button
                key={share.id}
                className="pixel-button is-fullwidth mb-2"
                onClick={() => router.push(`/entries/${share.entry?.id}`)}
              >
                {share.entry_details?.title || share.course_details?.title}
              </button>
            )) : <p className="pixel-text">No shares yet</p>}
          </div>
        </div>
      </div>

      {/* Update Profile Button - Bottom Right */}
      <div className="column is-one-quarter is-offset-half">
        <div className="pixel-box">
          <button
            className="pixel-button is-large is-fullwidth"
            onClick={() => router.push("/profile/update")}
          >
            ⚒ Update Profile
          </button>
        </div>
      </div>
    </div>
  </div>
);

}
