import React, { useState } from "react";
const logoPath = require("./logo.svg") as string;
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Aside,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
    Image,
} from "@mantine/core";

export default function App() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <AppShell
            styles={{
                main: {
                    background:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            fixed
            aside={
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <Aside
                        p="md"
                        hiddenBreakpoint="sm"
                        hidden={!opened}
                        width={{ sm: 200, lg: 300 }}
                    >
                        <Text>Application sidebar</Text>
                    </Aside>
                </MediaQuery>
            }
            header={
                <Header height={70} p="md">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <Image src={logoPath} alt="" width={50} height={50} />
                    </div>
                </Header>
            }
        >
            <Text>Resize app to see responsive navbar in action</Text>
        </AppShell>
    );
}
