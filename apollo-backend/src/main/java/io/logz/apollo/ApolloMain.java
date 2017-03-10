package io.logz.apollo;

import io.logz.apollo.configuration.ApolloConfiguration;
import io.logz.apollo.kubernetes.KubernetesMonitor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by roiravhon on 11/20/16.
 */

public class ApolloMain {

    private static final Logger logger = LoggerFactory.getLogger(ApolloMain.class);
    private static ApolloServer apolloServer;
    private static KubernetesMonitor kubernetesMonitor;

    public static void main(String[] args) {

        try {
            logger.info("Started apollo main");
            ApolloConfiguration apolloConfiguration = ApolloConfiguration.parseConfigurationFromResources();

            apolloServer = new ApolloServer(apolloConfiguration);
            apolloServer.start();

            // Not touching kubernetes on local run
            String localrun = System.getenv("localrun");
            if (localrun != null && !localrun.equals("true")) {
                try {
                    kubernetesMonitor = new KubernetesMonitor(apolloConfiguration);
                    kubernetesMonitor.start();
                } catch (Exception e) {
                    throw new RuntimeException("Could not start kubernetes monitor thread! Bailing..", e);
                }
            } else {
                logger.info("Running in local-mode, kubernetes monitor thread is not up.");
            }

            Runtime.getRuntime().addShutdownHook(new Thread(ApolloMain::shutdown));

        } catch (RuntimeException e) {
            logger.error(e.getMessage(), e);
            shutdown();
            System.exit(1);
        }
    }

    private static void shutdown() {
        logger.info("Cleaning up..");
        kubernetesMonitor.stop();
        apolloServer.stop();
    }
}
