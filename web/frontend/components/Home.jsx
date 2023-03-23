import {
    Layout,
    Card,
    Icon,
    Stack,
    Heading,
    Subheading,
    TextContainer,
    TextField,
    Link
  } from "@shopify/polaris";
  import "../assets/style.css"

  import { CircleInformationMajor } from "@shopify/polaris-icons";

export function Home() {
  return (
    <Layout>
      <Layout.Section primary>
        <Card title="Setup Instructions" sectioned>
          <Stack spacing="loose" vertical={true}>
            <TextContainer>
              <div className="d-flex">
                <h4>1. Add from the tags below to create your product title</h4>
                <div className="Tags-row">
                  <div className="Tags-button">Product Title</div>

                  <div className="Tags-button">Product Vendor</div>
                  <div className="Tags-button">Product Type</div>
                  <div className="Tags-button">Product Variant</div>
                  <div className="Tags-button">Custom Message</div>
                </div>
                <h4>
                  2. You can drag and drop to change the order of the different
                  elements
                </h4>
                <div className="Tags-row">
                <div style = {{display:"flex"}}>
                  <div className="Tags-button">
                    Product Vendor
                    <span className="svg--container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        role="presentation"
                        className="icon icon-close"
                        fill="none"
                        viewBox="0 0 18 17"
                      >
                        <path
                          d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <span class = "arrow-vertical">&#8693;</span>
                  <span class = "arrow-horizontal">&#8644;</span>
                  </div>
                  
                  
                  <div style = {{display:"flex"}}>
                  <div className="Tags-button">
                    Product Variant
                    <span className="svg--container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        role="presentation"
                        className="icon icon-close"
                        fill="none"
                        viewBox="0 0 18 17"
                      >
                        <path
                          d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <span class = "arrow-vertical">&#8693;</span>
                  <span class = "arrow-horizontal">&#8644;</span>
                  </div>
                  
                  <div style = {{display:"flex"}}>
                  <div className="Tags-button">
                    Custom Message
                    <span className="svg--container">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        role="presentation"
                        className="icon icon-close"
                        fill="none"
                        viewBox="0 0 18 17"
                      >
                        <path
                          d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <span class = "arrow-vertical">&#8693;</span>
                  <span class = "arrow-horizontal">&#8644;</span>
                </div>
              </div>
              </div>
            </TextContainer>
          </Stack>
        </Card>
      </Layout.Section>
      <Layout.Section secondary>
       <Card title = "Need some help setting up?" sectioned>
       <Stack spacing="loose" vertical={true}>
            <TextContainer>
           <p> Out team of developers will be happy to assist you, send an email to <Link url = "https://www.bbc.co.uk/sport">xzydevelopers@gmail.com</Link></p> 
           <p> Aliquam et tincidunt arcu, sit amet efficitur nisi. Duis at neque egestas, pretium lectus sit amet, fringilla ante.</p> 
             </TextContainer>
        </Stack>      
       </Card>
      </Layout.Section>
    </Layout>


  )
}
