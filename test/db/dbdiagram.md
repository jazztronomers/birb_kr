//// -- LEVEL 1
//// -- Tables and References

// Creating tables
Table users as U {
  user_id int [pk, increment] // auto-increment
  email varchar
  user_name varchar
  instagram_id varchar
  telegram_id varchar
  
}


Table content as C {
  content_id int [pk]
  user_id int 
  content_type  int      // photo, video
  publish_timestamp datetime
  observe_timestamp date
  object_storage_url varchar 
  del_yn  boolean
}

  Table content_meta as CM {
    content_id int [pk]
    observe_timestamp datetime
    latitude float
    longitude float
    
  }
  
  
  Table content_comment as CC {
    content_id int [pk]
    user_id int
    comment_timestamp datetime
  }

// > many-to-one; 
// < one-to-many; 
// - one-to-one

Ref: C.user_id > U.user_id
Ref: C.content_id > CC.content_id
Ref: C.content_id - CM.content_id