import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import axios from 'axios';
import { Button, Card, CardBody, CardFooter, HStack, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [bloggers, setBloggers] = useState({});
  const [loading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://pawsitive-backend-seven.vercel.app/blog/all');
      const data = response.data;
      console.log("data: ", data);
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  const getBlogger = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setBloggers(prevState => ({ ...prevState, [uid]: userData }));
        console.log("User data:", userData);
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }

  const removeHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  const Cutcontent = (content, maxLength) => {
    const sanitizedContent = removeHtmlTags(content);
    if (sanitizedContent.length > maxLength) {
      return sanitizedContent.substring(0, maxLength) + "...";
    } else {
      return sanitizedContent;
    }
  };
  const handleProfileClick = (userId) => {
    navigate(`/Profile/${userId}`);
  };
  const handleBlogClick = (blogId) => {
    navigate(`/ViewBlog/${blogId}`);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    blogs.forEach(blog => {
      getBlogger(blog.createdBy);
    });
  }, [blogs]);

  return (
    <>
      <Navbar />
      <div style={{width:"100vw", padding: "3vw 5vw",display: 'flex', flexDirection: 'column', justifyContent: "space-between", gap: '2vw' }}>
        {
          blogs.map((blog) => (
            <Card
              direction={{ base: 'column', sm: 'row' }}
              overflow='hidden'
              variant='outline'
              key={blog._id}
            >
              {bloggers[blog.createdBy] && (
                <>
                  <Image
                    objectFit='cover'
                    maxW={{ base: '100vw', sm: '250px' }}
                    src={blog.img}
                    alt=' img'
                  />
                  <Stack>
                    <CardBody style={{ cursor: "pointer" }} onClick={() => handleBlogClick(blog._id)}>
                      <Heading size='lg'>{blog.title}</Heading>
                      <Text py='2' fontSize={'lg'}>
                        {Cutcontent(removeHtmlTags(blog.content), 190)}
                      </Text>
                    </CardBody>
                    <CardFooter style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: "1vw", alignItems: "center" }}>
                        <img onClick={() => handleProfileClick(blog.createdBy)} id='blogger-pic' style={{ borderRadius: "50%", cursor: "pointer"}} src={bloggers[blog.createdBy].photoURL} alt="profile-pic" />
                        <Text fontSize={{base:"2xl",md:"1xl"}}>
                          {bloggers[blog.createdBy].displayName}
                        </Text>
                      </div>
                      <Text >
                        {new Date(blog.dateCreated).toDateString()}
                      </Text>
                    </CardFooter>
                  </Stack>
                </>
              )}
            </Card>
          ))
        }
      </div>
    </>
  )
}

export default Blog;