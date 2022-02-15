## 이미지 크롭관련


캔버스를 1:1 RATIO를 가지는 박스로 
현재 불러드린 이미지가 가로인지, 새로인지 판별하여 width 또는 height 기준으로 캔버스를 채우도록 수정
캔버스의 사이즈는 변하지 않도록 함 

-> 단일 가로이미지
-> 단일 세로이미지-
-> 단일 정방형 임지ㅣ
-> 정방형 이미지 시작 모든 케이스의 이미지
-> 세로형 이미지 시작 모든 케이스의 이미지
-> 가로형 임지ㅣ 시작 모든 케이스의 임지ㅣ


## 이미지 메타정보 관련

메타정보 입력값에 대한 상세구현

- species auto complete -> select all bird from db
- long, latitude from map click
- long, latitude apply to all photo
- 해시태그 및 간단한 메세지 첨부하는 기능

## 이미지 업로드 관련

S3 TEST BUCKET 으로 이미지 업로드
메타정보 MONGO DB 에 업로드

맵에서 해당 데이터 조회되는지 체크

## 유저 두개 만들어서 100개의 이미지 업로드

## 유저 개인화면

개인갤러리
    - 종태깅 없는 사진 따로 보기
    - 위치정보 태깅 없는 사진 따로보
개인 도감

## 모바일기기용 지도 배치 적용

## 초기화면 세팅 및 로그인 건너띄고 데이터 조회하는 기능 

## 로그인, 로그아웃 등 레이아웃 구체화

## 광고배치 고려

function getRawData(bounds, species, batch_size, limit)

if bounds => only observe level 1~2 includes in results
          => can not specify species with boundary condition

else      => all pics includes in results
          => In addition, species information can be inquired

batch_size: per


## flaticon

<i class="fi fi-rr-exclamation"></i>
<i class="fi fi-rr-eye-crossed"></i>

<i class="fi fi-rr-thumbs-up"></i>
<i class="fi fi-rr-trash"></i>

<i class="fa-regular fa-book"></i>
<i class="fa-regular fa-circle-info"></i>