import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";

type PageInfo = {
  name: string,
  component: JSX.Element
};

export const PageTabGroup = ({ pages }: Readonly<{
  pages: PageInfo[]
}>) => {
  return <div className="flex w-full h-full justify-center">
    <div className="w-full h-full p-2 max-w-2xl">
      <div>
        <TabGroup>
          <TabList className="flex gap-4">
            {pages.map(({ name }) => (
              <Tab
                key={name}
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white 
                focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 
                data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 
                data-[focus]:outline-white"
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-2">
            {pages.map(({ name, component }) => (
              <TabPanel key={name}>
                <ul>
                  {component}
                </ul>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </div>
};
